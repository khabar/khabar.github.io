import React from 'react'
import { IonApp, IonPage, IonRouterOutlet } from '@ionic/react'
import { Route } from 'react-router-dom'
import { IonReactRouter } from '@ionic/react-router'

import Home from './pages/Home'
import Feeds from './pages/Feeds'
import Reorder from './pages/Reorder'

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

const App: React.FunctionComponent = () => (
  <IonApp>
    <IonReactRouter>
      <IonPage id="main">
        <IonRouterOutlet id="main">
          <Route path="/feeds" component={Feeds} exact />
          <Route path="/reorder" component={Reorder} exact />
          <Route path="/" component={Home} exact />
          <Route component={Home} />
        </IonRouterOutlet>
      </IonPage>
    </IonReactRouter>
  </IonApp>
)

export default App
