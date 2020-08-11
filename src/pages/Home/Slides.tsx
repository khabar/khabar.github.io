import React, { useRef, useCallback, useEffect, useState } from 'react'
import { IonSlides } from '@ionic/react'
import cloneDeep from 'lodash/cloneDeep'
import { RefresherEventDetail } from '@ionic/core'

import { useGlobalState, setGlobalStatePersistent } from '../../state'
import Slide from '../../components/Slide'

// import { Plugins } from '@capacitor/core'
// await Plugins.Browser.prefetch({
//   urls: value.map((x: any) => x.source.targetUrl),
// })

const fetchArticles = async (feedId: string) =>
  (await fetch(`https://api.usepanda.com/v4/articles?feeds=${feedId}&limit=30&page=1&sort=latest`)).json()

const Slides: React.FC<{ index: number; onIndexChange: (i: number) => void }> = ({ index = 0, onIndexChange }) => {
  const [selectedFeeds] = useGlobalState('selectedFeeds')
  const [feedOrder] = useGlobalState('feedOrder')
  const [lastFetchedFeedId, setLastFetchedFeedId] = useState('')

  const [loading, setLoading] = useState(false)
  const [currentFeedId, setCurrentFeedId] = useState<string>()

  const slidesRef = useRef<HTMLIonSlidesElement>(null)

  const setSelectedFeeds = (values: { [key: string]: IFeed }) => setGlobalStatePersistent('selectedFeeds', values)

  const fetchAndSaveFeedData = useCallback(
    async (feedId: string, loadingStatus = true) => {
      setLoading(loadingStatus)
      const selectedFeedsClone = cloneDeep(selectedFeeds)
      const data = await fetchArticles(feedId)
      selectedFeedsClone[feedId].data = data
      selectedFeedsClone[feedId].updatedAt = Date.now()
      setSelectedFeeds(selectedFeedsClone)
      setLastFetchedFeedId(feedId)
      setLoading(false)
    },
    [selectedFeeds],
  )

  const hydrateFeedDataIfNeeded = useCallback(
    async (feedId: string) => {
      const feed = selectedFeeds[feedId]
      if (feed && Date.now() - (+feed.updatedAt || 0) > 60 * 60 * 1000) {
        console.log('Fetching feed data for: ' + feed.title)
        await fetchAndSaveFeedData(feedId)
      }
    },
    [selectedFeeds, fetchAndSaveFeedData],
  )

  const doRefresh = async (e: CustomEvent<RefresherEventDetail>) => {
    if (currentFeedId) {
      await fetchAndSaveFeedData(currentFeedId, false)
    }
    e.detail.complete()
  }

  const handleSlideChange = async () => {
    const slideIndex = (await slidesRef.current?.getActiveIndex()) || 0
    // const feedId = feedOrder[slideIndex]
    // setCurrentFeedId(feedId)
    onIndexChange(slideIndex)
    // await hydrateFeedData(feedId)
  }

  useEffect(() => {
    const handleIndex = () => {
      if (index >= 0 && index !== feedOrder.indexOf(currentFeedId)) {
        const feedId = feedOrder[index]
        setCurrentFeedId(feedId)
        slidesRef.current
          ?.slideTo(index)
          .then(() => hydrateFeedDataIfNeeded(feedId))
          .then(() => console.log('Slide index changed to: ' + index))
          .catch(console.error)
      }
    }

    if (!currentFeedId) {
      const firstFeedId = feedOrder[0]
      setCurrentFeedId(firstFeedId)
      hydrateFeedDataIfNeeded(firstFeedId).then(handleIndex).catch(console.error)
    } else {
      handleIndex()
    }
  }, [selectedFeeds, feedOrder, hydrateFeedDataIfNeeded, currentFeedId, index])

  return (
    <IonSlides ref={slidesRef} onIonSlideWillChange={handleSlideChange}>
      {(feedOrder as string[]).map((id: string, i) => (
        <Slide
          key={id + i}
          feed={selectedFeeds[id]}
          loading={loading}
          updated={lastFetchedFeedId === id}
          doRefresh={doRefresh}
        />
      ))}
    </IonSlides>
  )
}

export default Slides
