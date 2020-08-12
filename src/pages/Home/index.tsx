import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import {
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
import { isPlatform } from '@ionic/core'

import { useGlobalState, toggleTheme, setGlobalStatePersistent } from '../../state'
import logoSvg from '../../icons/logo.svg'
import Slides from './Slides'
import About from '../../components/About'
import useIsMounted from '../../utils/useIsMounted'

const Home: React.FC<RouteComponentProps> = ({ history }) => {
  const isMounted = useIsMounted()
  const [theme] = useGlobalState('theme')
  const [selectedFeeds] = useGlobalState('selectedFeeds')
  const [feedOrder] = useGlobalState('feedOrder')

  const [currentFeedId, setCurrentFeedId] = useState<string>()
  const [showPopover, setShowPopover] = useState<IShowPopover>({ open: false, event: undefined })
  const [showAboutModal, setShowAboutModal] = useState(false)

  const setFeedOrder = (values: string[]) => setGlobalStatePersistent('feedOrder', values)

  const handleSegmentChange = (e: any) => setCurrentFeedId(e.detail.value)
  const handleNavigationFAB = (i: number) => () => {
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

  const handleIndexChange = (i: number) => setCurrentFeedId(feedOrder[i])

  const handleMenuBtn = (path: string) => () => {
    handleMenuDismiss()
    history.replace(path)
  }

  useEffect(() => {
    if (!feedOrder.length) {
      history.replace('/feeds')
    } else if (!feedOrder.length) {
      const defaultFeedOrder = Object.keys(selectedFeeds)
      setFeedOrder(defaultFeedOrder)
    } else if (!currentFeedId) {
      setCurrentFeedId(feedOrder[0])
    }
  }, [feedOrder, selectedFeeds, history, currentFeedId])

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
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
            <IonButton onClick={(e) => setShowPopover({ open: true, event: e.nativeEvent })} slot="end">
              <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <Slides index={feedOrder.indexOf(currentFeedId)} onIndexChange={handleIndexChange} />
      {isPlatform('desktop') && (
        <>
          <IonFab vertical="center" horizontal="start" slot="fixed" hidden={feedOrder.indexOf(currentFeedId) === 0}>
            <IonFabButton size="small" translucent={true} onClick={handleNavigationFAB(-1)}>
              <IonIcon icon={chevronBack} />
            </IonFabButton>
          </IonFab>

          <IonFab
            vertical="center"
            horizontal="end"
            slot="fixed"
            hidden={feedOrder.indexOf(currentFeedId) === feedOrder.length - 1}
          >
            <IonFabButton size="small" translucent={true} onClick={handleNavigationFAB(1)}>
              <IonIcon icon={chevronForward} />
            </IonFabButton>
          </IonFab>
        </>
      )}

      <IonFooter>
        <IonSegment scrollable={true} value={currentFeedId} onIonChange={handleSegmentChange}>
          {(feedOrder as string[]).map((id, i) => {
            const feed = selectedFeeds[id]
            return (
              <IonSegmentButton key={id} value={id} data-index={'' + i} title={feed.title}>
                <img alt={feed.title} src={feed.icon} />
              </IonSegmentButton>
            )
          })}
        </IonSegment>
      </IonFooter>

      <IonModal isOpen={showAboutModal} swipeToClose={true} onDidDismiss={() => setShowAboutModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonIcon title="Khabar" slot="icon-only" src={logoSvg} />
            </IonButtons>

            <IonTitle>About</IonTitle>

            <IonButtons slot="end">
              <IonButton onClick={() => setShowAboutModal(false)}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <About />
      </IonModal>
    </IonApp>
  )
}

export default Home
