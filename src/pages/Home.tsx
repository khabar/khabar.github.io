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
  IonPage,
  IonFab,
  IonFabButton,
  createGesture,
  Gesture,
  IonToast,
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
  cloudOffline,
  flame,
  flameOutline,
  time,
  timeOutline,
} from 'ionicons/icons'
import { isPlatform, RefresherEventDetail } from '@ionic/core'
import cloneDeep from 'lodash/cloneDeep'
import { Plugins } from '@capacitor/core'

import { useGlobalState, toggleTheme, setGlobalStatePersistent, toggleSort } from '../state'
import logoSvg from '../icons/logo.svg'
import About from '../components/About'
import Card from '../components/Card'
import useIsMounted from '../utils/useIsMounted'
import apiRequest from '../utils/apiRequest'

const fetchArticles = async (feedId: string, sort:string) => apiRequest(`/v4/articles?feeds=${feedId}&limit=30&page=1&sort=${sort}`)

const HIDE_FOOTER = 'hide-footer'
const windowWidth = window.innerWidth

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const isMounted = useIsMounted()
  const [theme] = useGlobalState('theme')
  const [sort] = useGlobalState('sort')
  const [selectedFeeds] = useGlobalState('selectedFeeds')
  const [feedOrder] = useGlobalState('feedOrder')
  const [isOffline] = useGlobalState('isOffline')

  const [loading, setLoading] = useState(false)
  const [currentFeedId, setCurrentFeedId] = useState<string>('')
  const [showPopover, setShowPopover] = useState<IShowPopover>({ open: false, event: undefined })
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [isFooterHidden, setIsFooterHidden] = useState(false)
  const [error, setError] = useState('')

  const contentRef = useRef<HTMLIonContentElement>(null)
  const segmentRef = useRef<HTMLIonSegmentElement>(null)

  const setFeedOrder = (values: string[]) => setGlobalStatePersistent('feedOrder', values)
  const setSelectedFeeds = (values: { [key: string]: IFeed }) => setGlobalStatePersistent('selectedFeeds', values)

  const fetchAndSaveFeedData = useCallback(
    async (feedId: string, showLoading = true, sortOverride?:string) => {
      setLoading(showLoading)
      try {
        const selectedFeedsClone = cloneDeep(selectedFeeds)
        const data = await fetchArticles(feedId, sortOverride || sort)
        selectedFeedsClone[feedId].data = data
        selectedFeedsClone[feedId].updatedAt = Date.now()
        setSelectedFeeds(selectedFeedsClone)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    },
    [selectedFeeds, sort],
  )

  const hydrateFeedDataIfNeeded = useCallback(
    async (feedId: string) => {
      const feed = selectedFeeds[feedId]
      if ((feed && !feed.data?.length) || (feed && Date.now() - (+feed.updatedAt || 0) > 60 * 60 * 1000)) {
        console.log('Fetching feed data for: ' + feed.title)
        await fetchAndSaveFeedData(feedId)
      }
    },
    [selectedFeeds, fetchAndSaveFeedData],
  )

  const handleSegmentChange = (e: any) => setCurrentFeedId(e.detail.value)
  const handleNavigation = useCallback(
    (i: number) => () => {
      const newIndex = feedOrder.indexOf(currentFeedId) + i
      if (newIndex >= 0 && newIndex < feedOrder.length) setCurrentFeedId(feedOrder[newIndex])
    },
    [currentFeedId, feedOrder],
  )

  const handleMenuDismiss = () => isMounted.current && setShowPopover({ open: false, event: undefined })

  const handleThemeToggle = () => {
    handleMenuDismiss()
    toggleTheme()
  }

  const handleSortToggle = () => {
    handleMenuDismiss()
    toggleSort(async (sortBy:string) => await fetchAndSaveFeedData(currentFeedId, true, sortBy))
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

  const handleShowMenuPopover = (e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) =>
    setShowPopover({ open: true, event: e.nativeEvent })

  const handleContentScroll = async () => {
    const scrollTop = (await contentRef.current?.getScrollElement())?.scrollTop || 0
    const scrollDiff = lastScrollTop - scrollTop

    if (scrollDiff < 50) {
      if (!isFooterHidden) {
        segmentRef.current?.classList.add(HIDE_FOOTER)
        setIsFooterHidden(true)
      }
    } else if (isFooterHidden) {
      segmentRef.current?.classList.remove(HIDE_FOOTER)
      setIsFooterHidden(false)
    }

    setLastScrollTop(scrollTop)
  }

  useEffect(() => {
    let gesture: Gesture
    if (!feedOrder.length) {
      return history.push('/feeds')
    }

    if (!feedOrder.length) {
      const defaultFeedOrder = Object.keys(selectedFeeds)
      setFeedOrder(defaultFeedOrder)
    }

    if ((currentFeedId && !selectedFeeds[currentFeedId]) || !currentFeedId) {
      const firstFeedId = feedOrder[0]
      setCurrentFeedId(firstFeedId)
      hydrateFeedDataIfNeeded(firstFeedId).then(console.log).catch(console.error)
    } else {
      hydrateFeedDataIfNeeded(currentFeedId).then(console.log).catch(console.error)
    }

    if (contentRef.current) {
      gesture = createGesture({
        el: contentRef.current,
        gestureName: 'swipe-gesture',
        onMove: (ev) => {
          if (ev.deltaX > windowWidth / 2) {
            handleNavigation(-1)()
          } else if (ev.deltaX < -windowWidth / 2) {
            handleNavigation(1)()
          }
        },
      })
      gesture.enable()
    }

    Plugins.App.addListener('backButton', async () => {
      if (showAboutModal) {
        handleHideAboutModal()
      } else {
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
      gesture?.destroy()
      Plugins.App.removeAllListeners()
    }
  }, [feedOrder, selectedFeeds, history, currentFeedId, hydrateFeedDataIfNeeded, handleNavigation, showAboutModal])

  const data = (currentFeedId && selectedFeeds[currentFeedId]?.data) || []

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonIcon title="Khabar" slot="icon-only" src={logoSvg} />
          </IonButtons>

          <IonTitle>{currentFeedId ? selectedFeeds[currentFeedId]?.title : 'Khabar'}</IonTitle>
          <IonButtons slot="end">
            {isOffline && <IonIcon title="Offline" icon={cloudOffline} />}
            <IonButton onClick={handleSortToggle} slot="end" title={sort[0].toUpperCase() + sort.slice(1)} >
              <IonIcon slot="icon-only" ios={sort === 'popular' ? flameOutline : timeOutline} md={sort === 'popular' ? flame : time} />
            </IonButton>
            <IonPopover isOpen={showPopover.open} event={showPopover.event} onDidDismiss={handleMenuDismiss}>
              <IonItem detail={false}>
                <IonLabel>Theme</IonLabel>
                <IonToggle
                  checked={theme === 'light'}
                  color={theme === 'dark' ? 'light' : 'dark'}
                  onIonChange={handleThemeToggle}
                />
              </IonItem>
              <IonItem detail={false} button={true} onClick={handleMenuDismiss} routerLink="/feeds">
                <IonLabel>Feeds</IonLabel>
                <IonIcon title="Feed" md={add} ios={addOutline} slot="end" />
              </IonItem>
              <IonItem detail={false} button={true} onClick={handleMenuDismiss} routerLink="/reorder">
                <IonLabel>Reorder</IonLabel>
                <IonIcon title="Reorder" md={reorderTwoSharp} ios={reorderThreeOutline} slot="end" />
              </IonItem>
              <IonItem detail={false} button={true} onClick={handleOpenAboutModal}>
                <IonLabel>About</IonLabel>
                <IonIcon title="Reorder" icon={information} slot="end" />
              </IonItem>
            </IonPopover>
            <IonButton onClick={handleShowMenuPopover} slot="end" title="Menu">
              <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} className="article-content" scrollEvents={true} onIonScrollEnd={handleContentScroll}>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent refreshingSpinner="dots" />
        </IonRefresher>
        {(!currentFeedId || loading) && <IonSpinner className="w-100" name="dots" duration={30} />}
        {data.length
          ? data.map((article: IArticle) => <Card key={article._id} article={article} />)
          : [...new Array(12)].map((x, i) => <Card key={'card' + i} article={{} as IArticle} />)}
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
                fetchAndSaveFeedData(currentFeedId)
                  .then(() => console.log('Feeds fetched'))
                  .catch(console.error)
              },
            },
          ]}
        />
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
            return selectedFeeds[id] ? (
              <IonSegmentButton key={'segmentBtn' + id} value={id} data-index={'' + i} title={selectedFeeds[id].title}>
                <img alt={selectedFeeds[id].title} src={selectedFeeds[id].icon} />
              </IonSegmentButton>
            ) : null
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
    </IonPage>
  )
}

export default Home
