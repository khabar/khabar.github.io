import {
  IonButton,
  IonButtons,
  IonContent,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonItem,
  IonHeader,
  IonAvatar,
  IonSpinner,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonChip,
  IonToggle,
} from '@ionic/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import uniqBy from 'lodash/uniqBy'
import cloneDeep from 'lodash/cloneDeep'
import { RefresherEventDetail, SearchbarChangeEventDetail } from '@ionic/core'
import { RouteComponentProps } from 'react-router'

import logoSvg from '../icons/logo.svg'
import { useGlobalState, setGlobalStatePersistent } from '../state'

const fuseOptions = {
  minMatchCharLength: 2,
  threshold: 0.4,
  keys: ['title', 'description', 'categories'],
}

const fetchFeedsByTag = async (tagId: string): Promise<IFeed[]> =>
  (await fetch(`https://api.usepanda.com/v4/feeds/query?category=${tagId.split('$').pop()}&limit=100&page=1`)).json()

const Feeds: React.FC<RouteComponentProps> = ({ history }) => {
  const [feeds] = useGlobalState('feeds')
  const [selectedFeeds] = useGlobalState('selectedFeeds')
  const [feedOrder] = useGlobalState('feedOrder')
  const [tags] = useGlobalState('tags')
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedTag, setSelectedTag] = useState('source-category$featured')
  const [subTags, setSubTags] = useState<ITag[]>([])
  const [selectedSubTag, setSelectedSubTag] = useState('')
  const [filteredFeeds, setFilteredFeeds] = useState<IFeed[]>([])

  const contentRef = useRef<HTMLIonContentElement>(null)
  const fuse = new Fuse(feeds, fuseOptions)

  const handleTagFilter = useCallback(
    (tagId: string, newFeeds?: IFeed[]) => {
      setLoading(true)
      setFilteredFeeds((newFeeds || (feeds as IFeed[])).filter(({ categories }) => categories.includes(tagId)))
      setLoading(false)
    },
    [feeds],
  )

  const fetchFeeds = async (showLoading = true) => {
    try {
      setLoading(showLoading)
      const tagsData = await (await fetch('https://api.usepanda.com/v1/tags')).json()

      const feedsDataArray = await Promise.all(
        (tagsData as ITag[]).reduce((acc: Promise<IFeed[]>[], { _id, children }) => {
          if (children.length) {
            acc = acc.concat(children.map((x) => fetchFeedsByTag(x._id)))
          } else {
            acc.push(fetchFeedsByTag(_id))
          }
          return acc
        }, []),
      )

      setGlobalStatePersistent('feeds', uniqBy(([] as IFeed[]).concat(...feedsDataArray), 'id'))
      setGlobalStatePersistent('tags', tagsData)
      setLoading(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleTagSelect = (_id: string, children: ITag[]) => () => {
    setSelectedTag(_id)
    setSubTags(children)
    setSelectedSubTag(children.length ? children[0]._id : '')
    handleTagFilter(children.length ? children[0]._id : _id)
  }

  const handleSubTagSelect = (_id: string) => () => {
    setSelectedSubTag(_id)
    handleTagFilter(_id)
  }

  const handleToggleSelectFeed = (feed: IFeed) => async () => {
    const { id } = feed
    const selectedFeedsClone = cloneDeep(selectedFeeds)
    if (selectedFeedsClone[id]) {
      delete selectedFeedsClone[id]

      const newFeedOrder = [...feedOrder]
      const index = newFeedOrder.indexOf(id)
      if (index > -1) {
        newFeedOrder.splice(index, 1)

        setGlobalStatePersistent('feedOrder', newFeedOrder)
      }
    } else {
      selectedFeedsClone[id] = feed
      setGlobalStatePersistent('feedOrder', [...new Set([...feedOrder, id])])
    }

    setGlobalStatePersistent('selectedFeeds', selectedFeedsClone)
    if (selectedFeedsClone[id]) {
      fetch(`https://api.usepanda.com/v4/articles?feeds=${id}&limit=30&page=1&sort=latest`)
        .then((res) => res.json())
        .then((data) => {
          const selectedFeedsCloneData = cloneDeep(selectedFeedsClone)
          selectedFeedsCloneData[id].data = data
          selectedFeedsCloneData[id].updatedAt = Date.now()
          setGlobalStatePersistent('selectedFeeds', selectedFeedsCloneData)
        })
        .catch(console.error)
    }
  }

  const handleSearch = (e: CustomEvent<SearchbarChangeEventDetail | void>) => {
    if (e.detail && e.detail.value) {
      const value = e.detail.value
      setSearchText(value)
      setFilteredFeeds(fuse.search(value).map(({ item }) => item as IFeed))
    } else {
      setSearchText('')
      handleTagFilter(selectedSubTag || selectedTag)
    }
  }

  const doRefresh = async (e: CustomEvent<RefresherEventDetail>) => {
    await fetchFeeds(false)
    e.detail.complete()
  }

  useEffect(() => {
    if (feeds.length && tags.length) {
      if (!filteredFeeds.length) handleTagFilter(selectedTag)
    } else {
      fetchFeeds()
        .then(() => console.log('Feeds fetched'))
        .catch(console.error)
    }
  }, [feeds, tags, selectedTag, handleTagFilter, filteredFeeds])

  const selectedFeedIds = Object.keys(selectedFeeds)

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonIcon title="Khabar" slot="icon-only" src={logoSvg} />
          </IonButtons>
          <IonTitle>Khabar</IonTitle>
          <IonButtons slot="end">
            <IonButton disabled={Object.keys(selectedFeeds).length === 0} onClick={() => history.replace('/')}>
              Done
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="feed-content" ref={contentRef}>
        <IonSearchbar
          value={searchText}
          placeholder="Type website name or topic"
          onIonChange={handleSearch}
          onIonCancel={handleSearch}
        />

        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent refreshingSpinner="dots" />
        </IonRefresher>

        {loading && <IonSpinner className="w-100" name="dots" duration={30} />}
        {searchText === '' && (
          <div className="text-center">
            {(tags as ITag[]).map(({ _id, displayName, children }, i) => (
              <IonChip
                key={_id}
                {...(selectedTag === _id ? { color: 'secondary', outline: true } : {})}
                onClick={handleTagSelect(_id, children)}
              >
                <IonLabel>{displayName}</IonLabel>
              </IonChip>
            ))}
            {subTags.length > 0 && (
              <>
                <h4>Be more specific</h4>
                {subTags.map(({ _id, displayName }) => (
                  <IonChip
                    key={_id}
                    className="sub-tag"
                    {...(selectedSubTag === _id ? { color: 'secondary', outline: true } : {})}
                    onClick={handleSubTagSelect(_id)}
                  >
                    <IonLabel>{displayName}</IonLabel>
                  </IonChip>
                ))}
              </>
            )}
          </div>
        )}
        {filteredFeeds.map((x) => (
          <IonItem detail={false} key={x.id} className="w-100">
            <IonAvatar slot="start">
              <img alt={x.title} src={x.icon} />
            </IonAvatar>
            <IonLabel className="ion-text-wrap">
              <h3>{x.title}</h3>
              <p>{x.description}</p>
            </IonLabel>
            <IonToggle slot="end" checked={selectedFeedIds.includes(x.id)} onIonChange={handleToggleSelectFeed(x)} />
          </IonItem>
        ))}
      </IonContent>
    </>
  )
}

export default Feeds
