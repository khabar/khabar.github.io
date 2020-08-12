import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonItem,
  IonHeader,
  IonIcon,
  IonAvatar,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonReorderGroup,
  IonReorder,
  IonApp,
} from '@ionic/react'

import { ItemReorderEventDetail } from '@ionic/core'
import cloneDeep from 'lodash/cloneDeep'

import { useGlobalState, setGlobalStatePersistent } from '../state'

import logoSvg from '../icons/logo.svg'

const Reorder: React.FC<RouteComponentProps> = ({ history }) => {
  const [selectedFeeds] = useGlobalState('selectedFeeds')
  const [feedOrder] = useGlobalState('feedOrder')

  const setFeedOrder = (values: string[]) => setGlobalStatePersistent('feedOrder', values)

  const handleReorder = async (e: CustomEvent<ItemReorderEventDetail>) => {
    if (!e || !e.detail) {
      return
    }

    if (e.detail.from === e.detail.to) {
      return
    }

    const newFeedOrder: string[] = cloneDeep(feedOrder)

    newFeedOrder.splice(e.detail.to, 0, ...newFeedOrder.splice(e.detail.from, 1))

    setFeedOrder(newFeedOrder)

    e.detail.complete()
  }

  const handleDoneBtn = () => history.replace('/')

  useEffect(() => {
    if (!feedOrder.length) {
      const defaultFeedOrder = Object.keys(selectedFeeds)
      setFeedOrder(defaultFeedOrder)
    }
  }, [selectedFeeds, feedOrder])

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonIcon title="Khabar" slot="icon-only" src={logoSvg} />
          </IonButtons>

          <IonTitle>Reorder</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={handleDoneBtn}>Done</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="feed-content">
        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
          {(feedOrder as string[]).map((id: string) => (
            <IonItem detail={false} key={id}>
              <IonAvatar slot="start">
                <img
                  style={{
                    height: '2em',
                    borderRadius: '1em',
                  }}
                  alt={selectedFeeds[id].title}
                  src={selectedFeeds[id].icon}
                />
              </IonAvatar>
              <IonLabel className="ion-text-wrap">
                <h3>{selectedFeeds[id].title}</h3>
                <p>{selectedFeeds[id].description}</p>
              </IonLabel>
              <IonReorder slot="end" />
            </IonItem>
          ))}
        </IonReorderGroup>
      </IonContent>
    </IonApp>
  )
}

export default Reorder
