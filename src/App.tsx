import React, { useEffect } from 'react'
import { IonApp, IonPage } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { GlobalStateProvider } from './state'
import fetchData from './utils/fetchData'
import Tabs from './components/Tabs'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
import './styles.css'

const App: React.FunctionComponent = () => {
  useEffect(() => {
    fetchData().catch(console.error)
  }, [])

  return (
    <GlobalStateProvider>
      <IonApp>
        <IonReactRouter>
          <IonPage id="main">
            <Tabs />
          </IonPage>
        </IonReactRouter>
      </IonApp>
    </GlobalStateProvider>
  )
}

export default App
