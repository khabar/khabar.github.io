import {
  IonButton,
  IonButtons,
  IonContent,
  IonCard,
  IonCardHeader,
  IonItem,
  IonHeader,
  IonIcon,
  IonAvatar,
  IonSpinner,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonCardContent,
  IonToolbar,
  IonFooter,
} from '@ionic/react'
import React from 'react'
import { arrowDropup, chatboxes, contrast } from 'ionicons/icons'

import sources from '../sources'
import { useGlobalState, toggleTheme, setSegment } from '../state'
import timeAgo from '../utils/timeAgo'
import fetchData from '../utils/fetchData'

type Source = {
  title: string
}

const Home = () => {
  const [segment] = useGlobalState('segment')
  const source = sources.find(({ path }) => path === segment) as Source
  const [data] = useGlobalState(segment as any)
  const [loading] = useGlobalState('loading')
  type Entry = typeof data[0]

  const doRefresh = async (e: any) => {
    await fetchData(segment)
    e.detail.complete()
  }

  const updateSegment = (e: any) => setSegment(e.detail.value)
console.log(segment)
  return (
    <>
      <IonHeader>
        <IonToolbar className={segment}>
          <IonButtons slot="start">
            <IonIcon
              title="Khabar"
              slot="icon-only"
              src={require('../icons/logo.svg')}
            />
          </IonButtons>

          <IonTitle>{source.title}</IonTitle>
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

      <IonContent className={segment}>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent refreshingSpinner="dots" />
        </IonRefresher>
        {data.map((x: Entry) => (
          <IonCard key={x._id}>
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
                hidden={segment === 'medium'}
                className="sub-link"
                href={x.source.sourceUrl}
                target="_system"
                rel="noopener noreferrer"
              >
                {x.source.likesCount}
                <IonIcon
                  title="Up-votes"
                  icon={arrowDropup.md}
                  className="up-arrow"
                />
                {x.source.commentsCount}
                <IonIcon
                  title="Comments"
                  style={{ marginLeft: '.15em' }}
                  icon={chatboxes.md}
                />
              </a>
              {` ${timeAgo(x.source.createdAt)} by `}
              <a
                className="sub-link"
                href={
                  ['reddit', 'redditprogramming'].includes(segment)
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
      <IonFooter className={segment}>
        <IonSegment scrollable onIonChange={updateSegment}>
          {sources.map(({ path, title, icon, src }) => (
            <IonSegmentButton
              key={path}
              value={path}
              checked={segment === path}
            >
              <IonIcon title={title} {...(icon ? { icon } : { src })} />
            </IonSegmentButton>
          ))}
        </IonSegment>
      </IonFooter>
    </>
  )
}

export default Home
