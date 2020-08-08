import React from 'react'
import {
  IonSpinner,
  IonContent,
  IonHeader,
  IonTitle,
  IonItem,
  IonLabel,
  IonToolbar,
  IonAvatar,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButtons,
  IonButton,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react'
import { caretUp, chatbubble, contrast } from 'ionicons/icons'

import { useGlobalState, toggleTheme } from '../state'
import timeAgo from '../utils/timeAgo'
import fetchData from '../utils/fetchData'

type Props = {
  path: any
  title: string
}

const TabContent = ({ path, title }: Props) => {
  const [data] = useGlobalState(path)
  const [loading] = useGlobalState('loading')
  type Entry = typeof data[0]
  const doRefresh = async (e: any) => {
    await fetchData(path)
    e.detail.complete()
  }

  return (
    <>
      <IonHeader>
        <IonToolbar className={path}>
          <IonButtons slot="start">
            <IonIcon
              title="Khabar"
              slot="icon-only"
              src={require('../icons/logo.svg')}
            />
          </IonButtons>

          <IonTitle>{title}</IonTitle>
          {loading && <IonSpinner name="dots" slot="end" duration={30} />}
          <IonButtons slot="end">
            <IonButton onClick={toggleTheme}>
              <IonIcon
                title="Toggle theme"
                className="theme-toggle"
                icon={contrast}
                slot="icon-only"
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent refreshingSpinner="dots" />
        </IonRefresher>
        {data.map((x: Entry) => (
          <IonCard key={x._id} className={path}>
            <IonCardHeader className="p-0">
              <IonItem
                button
                onClick={() => window.open(x.source.targetUrl, '_system')}
                lines="none"
              >
                <IonAvatar className="favicon" slot="start">
                  <img
                    alt={x.source.displayName}
                    src={`https://www.google.com/s2/favicons?domain=${x.source.targetUrl}`}
                  />
                </IonAvatar>

                <IonLabel className="item-text">
                  <h2>{x.title}</h2>
                  {x.description && <p>{x.description}</p>}
                </IonLabel>
              </IonItem>
            </IonCardHeader>

            <IonCardContent className="item-footer">
              <a
                hidden={path === 'medium'}
                className="sub-link"
                href={x.source.sourceUrl}
                target="_system"
                rel="noopener noreferrer"
              >
                {x.source.likesCount}
                <IonIcon title="Up-votes" icon={caretUp} className="up-arrow" />
                {x.source.commentsCount}
                <IonIcon
                  title="Comments"
                  style={{ marginLeft: '.15em' }}
                  icon={chatbubble}
                />
              </a>
              {` ${timeAgo(x.source.createdAt)} by `}
              <a
                className="sub-link"
                href={
                  path === 'reddit'
                    ? `https://reddit.com/u/${x.source.username}`
                    : x.source.authorUrl
                }
                target="_system"
                rel="noopener noreferrer"
              >
                {x.source.authorName || x.source.username}
              </a>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </>
  )
}

export default React.memo(TabContent)
