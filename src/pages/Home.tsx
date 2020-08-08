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
  IonSlides,
  IonSlide,
} from '@ionic/react'
import { Plugins } from '@capacitor/core'
import React, { useState } from 'react'
import { caretUp, chatbubble, contrast } from 'ionicons/icons'

import sources from '../sources'
import { useGlobalState, toggleTheme, setSegment } from '../state'
import timeAgo from '../utils/timeAgo'
import fetchData from '../utils/fetchData'

type Source = {
  title: string
}

const _contentRef = React.createRef<any>()
const _slidesRef = React.createRef<any>()

const Home = () => {
  const [segment] = useGlobalState('segment')
  const source = sources.find(({ path }) => path === segment) as Source
  const [loading] = useGlobalState('loading')
  const [currentSegment, setCurrentSegment] = useState(sources[0].path)

  const doRefresh = async (e: any) => {
    await fetchData(segment)
    e.detail.complete()
  }

  const openUrl = (url: string) => async () =>
    await Plugins.Browser.open({ url })

  const updateSegment = async (e: any) => {
    console.log(e)
    setCurrentSegment(e.detail.value)
    await _slidesRef.current.slideTo(+e.explicitOriginalTarget.dataset.index)
  }

  const onSlideChange = async () => {
    setSegment(sources[await _slidesRef.current.getActiveIndex()].path)
    _contentRef.current.scrollToTop()
  }

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

      <IonContent ref={_contentRef}>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent refreshingSpinner="dots" />
        </IonRefresher>
        <IonSlides
          ref={_slidesRef}
          options={{
            initialSlide: 0,
            slidesPerView: 1,
          }}
          onIonSlideWillChange={onSlideChange}
        >
          {sources
            .filter(({ path }) => localStorage[path])
            .map(({ path, title }) => {
              const data = JSON.parse(localStorage[path])
              type Entry = typeof data[0]
              return (
                <IonSlide key={path} title={title} className={`cards ${path}`}>
                  {data.map((x: Entry) => (
                    <IonCard key={x._id}>
                      <IonCardHeader className="p-0">
                        <IonItem
                          button
                          onClick={openUrl(x.source.targetUrl)}
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
                            icon={caretUp}
                            className="up-arrow"
                          />
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
                </IonSlide>
              )
            })}
        </IonSlides>
      </IonContent>
      <IonFooter className={segment}>
        <IonSegment
          scrollable
          onIonChange={updateSegment}
          value={currentSegment}
        >
          {sources.map(({ path, title, icon, src }, i) => (
            <IonSegmentButton key={path} value={path} data-index={'' + i}>
              <IonIcon title={title} {...(icon ? { icon } : { src })} />
            </IonSegmentButton>
          ))}
        </IonSegment>
      </IonFooter>
    </>
  )
}

export default Home
