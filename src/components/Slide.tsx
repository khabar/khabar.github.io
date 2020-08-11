import React from 'react'
import { IonContent, IonRefresher, IonRefresherContent, IonSpinner, IonSlide } from '@ionic/react'
import { RefresherEventDetail } from '@ionic/core'

import Card from './Card'

interface IProps {
  feed: IFeed
  loading: boolean
  doRefresh?: (e: CustomEvent<RefresherEventDetail>) => void
  updated: boolean
}

const Slide: React.FC<IProps> = ({ feed, loading, doRefresh, updated }) => {
  const { title, data = [] } = feed
  return (
    <IonSlide title={title} className="block">
      <IonContent className="slide-content">
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent refreshingSpinner="dots" />
        </IonRefresher>
        {loading && <IonSpinner name="dots" duration={30} />}
        {data.map((article: any) => (
          <Card key={article._id} article={article} />
        ))}
        {updated}
      </IonContent>
    </IonSlide>
  )
}

export default Slide
