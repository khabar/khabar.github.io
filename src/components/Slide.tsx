import React from 'react'
import { IonContent, IonRefresher, IonRefresherContent, IonSpinner, IonSlide } from '@ionic/react'
import { RefresherEventDetail } from '@ionic/core'

import Card from './Card'

interface IProps {
  data: IArticle[]
  loading: boolean
  doRefresh?: (e: CustomEvent<RefresherEventDetail>) => void
}

const Slide: React.FC<IProps> = ({ data = [], loading, doRefresh }) => (
  <IonSlide className="block">
    <IonContent className="slide-content">
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
        <IonRefresherContent refreshingSpinner="dots" />
      </IonRefresher>
      {loading && <IonSpinner name="dots" duration={30} />}
      {data.map((article: any) => (
        <Card key={article._id} article={article} />
      ))}
    </IonContent>
  </IonSlide>
)

export default React.memo(Slide)
