import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'

const Home: React.FunctionComponent = () => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Khabar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">Taja Khabar!</IonContent>
    </>
  )
}

export default Home
