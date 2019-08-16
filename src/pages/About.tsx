import React from 'react'
import {
  IonContent,
  IonHeader,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonToolbar,
} from '@ionic/react'

const About: React.FunctionComponent = () => (
  <>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
        </IonButtons>
        <IonTitle>About</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">Taja Khabar!</IonContent>
  </>
)

export default React.memo(About)
