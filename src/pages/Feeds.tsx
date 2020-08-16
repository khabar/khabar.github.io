import {
  IonButton,
  IonButtons,
  IonPage,
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
  IonSkeletonText,
  IonToast,
} from '@ionic/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import uniqBy from 'lodash/uniqBy'
import cloneDeep from 'lodash/cloneDeep'
import { RefresherEventDetail, SearchbarChangeEventDetail } from '@ionic/core'
import { RouteComponentProps } from 'react-router'
import { cloudOffline } from 'ionicons/icons'
import { Plugins } from '@capacitor/core'

import logoSvg from '../icons/logo.svg'
import { useGlobalState, setGlobalStatePersistent } from '../state'
import apiRequest from '../utils/apiRequest'
import useIsMounted from '../utils/useIsMounted'

const fuseOptions = {
  minMatchCharLength: 2,
  threshold: 0.4,
  keys: ['title', 'description', 'categories'],
}

const fetchFeedsByTag = async (tagId: string): Promise<IFeed[]> =>
  apiRequest(`/v4/feeds/query?category=${tagId.split('$').pop()}&limit=100&page=1`)

const Feeds: React.FC<RouteComponentProps> = () => {
  const mounted = useIsMounted()
  const [feeds] = useGlobalState('feeds')
  const [selectedFeeds] = useGlobalState('selectedFeeds')
  const [feedOrder] = useGlobalState('feedOrder')
  const [tags] = useGlobalState('tags')
  const [isOffline] = useGlobalState('isOffline')
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedTag, setSelectedTag] = useState('source-category$featured')
  const [subTags, setSubTags] = useState<ITag[]>([])
  const [selectedSubTag, setSelectedSubTag] = useState('')
  const [filteredFeeds, setFilteredFeeds] = useState<IFeed[]>([])
  const [error, setError] = useState('')

  const contentRef = useRef<HTMLIonContentElement>(null)
  const fuse = new Fuse(feeds, fuseOptions)

  const setSelectedFeeds = (value: { [key: string]: IFeed }) => setGlobalStatePersistent('selectedFeeds', value)
  const setFeedOrder = (value: string[]) => setGlobalStatePersistent('feedOrder', value)

  const handleTagFilter = useCallback(
    (tagId: string, newFeeds?: IFeed[]) => {
      setLoading(true)
      setFilteredFeeds((newFeeds || (feeds as IFeed[])).filter(({ categories }) => categories.includes(tagId)))
      setLoading(false)
    },
    [feeds],
  )

  const fetchFeeds = useCallback(
    async (showLoading = true) => {
      setLoading(showLoading)
      try {
        const tagsData = await apiRequest('/v1/tags')

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
      } catch (e) {
        setError(e.message)
      } finally {
        if (mounted.current) setLoading(false)
      }
    },
    [mounted],
  )

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

      setSelectedFeeds(selectedFeedsClone)

      if (index > -1) {
        newFeedOrder.splice(index, 1)
        setFeedOrder(newFeedOrder)
      }
    } else {
      selectedFeedsClone[id] = feed
      setSelectedFeeds(selectedFeedsClone)
      setFeedOrder([...new Set([...feedOrder, id])])
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

    Plugins.App.addListener('backButton', async () => {
      if (!Object.keys(selectedFeeds).length) {
        const { value } = await Plugins.Modals.confirm({
          title: 'Exit',
          message: 'Are you sure you want to exit?',
          cancelButtonTitle: 'No',
          okButtonTitle: 'Yes',
        })

        if (value) Plugins.App.exitApp()
      }
    })

    return () => {
      Plugins.App.removeAllListeners()
    }
  }, [feeds, tags, selectedTag, handleTagFilter, filteredFeeds, selectedFeeds, fetchFeeds])

  const selectedFeedIds = Object.keys(selectedFeeds)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonIcon title="Khabar" slot="icon-only" src={logoSvg} />
          </IonButtons>
          <IonTitle>Feeds</IonTitle>
          <IonButtons slot="end">
            {isOffline && <IonIcon title="Offline" icon={cloudOffline} />}
            <IonButton disabled={Object.keys(selectedFeeds).length === 0} routerLink="/home">
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
            {tags.length
              ? (tags as ITag[]).map(({ _id, displayName, children }, i) => (
                  <IonChip
                    key={_id}
                    {...(selectedTag === _id ? { color: 'secondary', outline: true } : {})}
                    onClick={handleTagSelect(_id, children)}
                  >
                    <IonLabel>{displayName}</IonLabel>
                  </IonChip>
                ))
              : [...new Array(12)].map((x, i) => (
                  <IonChip key={'chips' + i}>
                    <IonSkeletonText
                      animated={true}
                      style={{ width: Math.floor(Math.random() * (i + 30)) + 20 + 'px' }}
                    />
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
        {filteredFeeds.length
          ? filteredFeeds.map((x) => (
              <IonItem detail={false} key={x.id} className="w-100">
                <IonAvatar slot="start">
                  <img alt={x.title} src={x.icon} />
                </IonAvatar>
                <IonLabel className="ion-text-wrap">
                  <h3>{x.title}</h3>
                  <p>{x.description}</p>
                </IonLabel>
                <IonToggle
                  slot="end"
                  checked={selectedFeedIds.includes(x.id)}
                  onIonChange={handleToggleSelectFeed(x)}
                />
              </IonItem>
            ))
          : [...new Array(12)].map((x, i) => (
              <IonItem key={'skeleton' + i} detail={false} className="w-100">
                <IonAvatar slot="start">
                  <IonSkeletonText animated={true} />
                </IonAvatar>
                <IonLabel className="ion-text-wrap">
                  <h3>
                    <IonSkeletonText animated={true} style={{ width: '45%' }} />
                  </h3>
                  <p>
                    <IonSkeletonText animated={true} style={{ width: '85%' }} />
                  </p>
                </IonLabel>
                <IonSkeletonText slot="end" animated={true} style={{ width: '10%' }} />
              </IonItem>
            ))}
        <IonToast
          isOpen={error !== ''}
          color="danger"
          duration={15000}
          onDidDismiss={() => setError('')}
          message={error}
          buttons={[
            {
              text: 'Retry',
              handler: () => {
                fetchFeeds()
                  .then(() => console.log('Feeds fetched'))
                  .catch(console.error)
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  )
}

export default Feeds
