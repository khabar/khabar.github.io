import React, { useEffect, useState, useCallback, useRef } from 'react'
import { RouteComponentProps } from 'react-router'
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonButton,
  IonButtons,
  IonItem,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  IonFooter,
  IonPopover,
  IonToggle,
  IonModal,
  IonApp,
  IonFab,
  IonFabButton,
} from '@ionic/react'
import {
  add,
  addOutline,
  ellipsisVertical,
  ellipsisHorizontal,
  information,
  chevronBack,
  chevronForward,
  reorderThreeOutline,
  reorderTwoSharp,
} from 'ionicons/icons'
import { isPlatform, RefresherEventDetail, ScrollDetail } from '@ionic/core'
import cloneDeep from 'lodash/cloneDeep'
import { useSwipeable } from 'react-swipeable'

import { useGlobalState, toggleTheme, setGlobalStatePersistent } from '../state'
import logoSvg from '../icons/logo.svg'
import About from '../components/About'
import Card from '../components/Card'
import useIsMounted from '../utils/useIsMounted'

const fetchArticles = async (feedId: string) =>
  (await fetch(`https://api.usepanda.com/v4/articles?feeds=${feedId}&limit=30&page=1&sort=latest`)).json()

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const isMounted = useIsMounted()
  const [theme] = useGlobalState('theme')
  const [selectedFeeds] = useGlobalState('selectedFeeds')
  const [feedOrder] = useGlobalState('feedOrder')

  const [loading, setLoading] = useState(false)
  const [currentFeedId, setCurrentFeedId] = useState<string>('')
  const [showPopover, setShowPopover] = useState<IShowPopover>({ open: false, event: undefined })
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0)

  const toolbarRef = useRef<HTMLIonToolbarElement>(null)
  const segmentRef = useRef<HTMLIonSegmentElement>(null)

  const setFeedOrder = (values: string[]) => setGlobalStatePersistent('feedOrder', values)
  const setSelectedFeeds = (values: { [key: string]: IFeed }) => setGlobalStatePersistent('selectedFeeds', values)

  const fetchAndSaveFeedData = useCallback(
    async (feedId: string, showLoading = true) => {
      setLoading(showLoading)
      const selectedFeedsClone = cloneDeep(selectedFeeds)
      const data = await fetchArticles(feedId)
      selectedFeedsClone[feedId].data = data
      selectedFeedsClone[feedId].updatedAt = Date.now()
      setSelectedFeeds(selectedFeedsClone)
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

  const handleSegmentChange = (e: any) => setCurrentFeedId(e.detail.value)
  const handleNavigation = (i: number) => () => {
    const newIndex = feedOrder.indexOf(currentFeedId) + i
    if (newIndex >= 0 && newIndex < feedOrder.length) setCurrentFeedId(feedOrder[newIndex])
  }

  const handleMenuDismiss = () => isMounted.current && setShowPopover({ open: false, event: undefined })

  const handleThemeToggle = () => {
    handleMenuDismiss()
    toggleTheme()
  }

  const handleOpenAboutModal = () => {
    handleMenuDismiss()
    setShowAboutModal(true)
  }

  const handleHideAboutModal = () => setShowAboutModal(false)

  const doRefresh = async (e: CustomEvent<RefresherEventDetail>) => {
    if (currentFeedId) {
      await fetchAndSaveFeedData(currentFeedId, false)
    }
    e.detail.complete()
  }

  const handleMenuBtn = (path: string) => () => {
    handleMenuDismiss()
    history.replace(path)
  }

  const handleShowMenuPopover = (e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) =>
    setShowPopover({ open: true, event: e.nativeEvent })

  const handleContentScroll = ({ detail }: CustomEvent<ScrollDetail>) => {
    if (detail.scrollTop > lastScrollTop && lastScrollTop > 200) {
      toolbarRef.current?.classList.add('hide-header')
      segmentRef.current?.classList.add('hide-footer')
    } else {
      toolbarRef.current?.classList.remove('hide-header')
      segmentRef.current?.classList.remove('hide-footer')
    }
    setLastScrollTop(detail.scrollTop <= 0 ? 0 : detail.scrollTop)
  }

  const swipeEvents = useSwipeable({ onSwipedLeft: handleNavigation(1), onSwipedRight: handleNavigation(-1) })

  useEffect(() => {
    if (!feedOrder.length) {
      return history.replace('/feeds')
    }

    if (!feedOrder.length) {
      const defaultFeedOrder = Object.keys(selectedFeeds)
      setFeedOrder(defaultFeedOrder)
    }

    if (!currentFeedId) {
      const firstFeedId = feedOrder[0]
      setCurrentFeedId(firstFeedId)
      hydrateFeedDataIfNeeded(firstFeedId).then(console.log).catch(console.error)
    } else {
      hydrateFeedDataIfNeeded(currentFeedId).then(console.log).catch(console.error)
    }
  }, [feedOrder, selectedFeeds, history, currentFeedId, hydrateFeedDataIfNeeded])

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar ref={toolbarRef} className="header">
          <IonButtons slot="start">
            <IonIcon title="Khabar" slot="icon-only" src={logoSvg} />
          </IonButtons>

          <IonTitle>{currentFeedId ? selectedFeeds[currentFeedId].title : 'Khabar'}</IonTitle>
          <IonButtons slot="end">
            <IonPopover isOpen={showPopover.open} event={showPopover.event} onDidDismiss={handleMenuDismiss}>
              <IonItem detail={false}>
                <IonLabel>Theme</IonLabel>
                <IonToggle
                  checked={theme === 'light'}
                  color={theme === 'dark' ? 'light' : 'dark'}
                  onIonChange={handleThemeToggle}
                />
              </IonItem>
              <IonItem detail={false} button={true} onClick={handleMenuBtn('/feeds')}>
                <IonLabel>Feed</IonLabel>
                <IonIcon title="Feed" md={add} ios={addOutline} slot="end" />
              </IonItem>
              <IonItem detail={false} button={true} onClick={handleMenuBtn('/reorder')}>
                <IonLabel>Reorder</IonLabel>
                <IonIcon title="Reorder" md={reorderTwoSharp} ios={reorderThreeOutline} slot="end" />
              </IonItem>
              <IonItem detail={false} button={true} onClick={handleOpenAboutModal}>
                <IonLabel>About</IonLabel>
                <IonIcon title="Reorder" icon={information} slot="end" />
              </IonItem>
            </IonPopover>
            <IonButton onClick={handleShowMenuPopover} slot="end">
              <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent {...swipeEvents} className="article-content" scrollEvents={true} onIonScroll={handleContentScroll}>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent refreshingSpinner="dots" />
        </IonRefresher>
        {(!currentFeedId || loading) && <IonSpinner className="w-100" name="dots" duration={30} />}
        {currentFeedId &&
          selectedFeeds[currentFeedId].data?.map((article: IArticle) => <Card key={article._id} article={article} />)}
      </IonContent>
      {isPlatform('desktop') && (
        <>
          <IonFab vertical="center" horizontal="start" slot="fixed" hidden={feedOrder.indexOf(currentFeedId) === 0}>
            <IonFabButton translucent={true} onClick={handleNavigation(-1)}>
              <IonIcon icon={chevronBack} />
            </IonFabButton>
          </IonFab>

          <IonFab
            vertical="center"
            horizontal="end"
            slot="fixed"
            hidden={feedOrder.indexOf(currentFeedId) === feedOrder.length - 1}
          >
            <IonFabButton translucent={true} onClick={handleNavigation(1)}>
              <IonIcon icon={chevronForward} />
            </IonFabButton>
          </IonFab>
        </>
      )}

      <IonFooter>
        <IonSegment
          ref={segmentRef}
          className="footer"
          scrollable={true}
          value={currentFeedId}
          onIonChange={handleSegmentChange}
        >
          {(feedOrder as string[]).map((id, i) => {
            const feed = selectedFeeds[id]
            return (
              <IonSegmentButton key={'segmentBtn' + id} value={id} data-index={'' + i} title={feed.title}>
                <img alt={feed.title} src={feed.icon} />
              </IonSegmentButton>
            )
          })}
        </IonSegment>
      </IonFooter>

      <IonModal isOpen={showAboutModal} swipeToClose={true} onDidDismiss={handleHideAboutModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonIcon title="Khabar" slot="icon-only" src={logoSvg} />
            </IonButtons>

            <IonTitle>About</IonTitle>

            <IonButtons slot="end">
              <IonButton onClick={handleHideAboutModal}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <About />
      </IonModal>
    </IonApp>
  )
}

export default Home
