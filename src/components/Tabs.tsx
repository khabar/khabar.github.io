import {
  IonIcon,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react'
import React from 'react'
import { Redirect, Route } from 'react-router'
import sources from '../sources'

const Tabs: React.FunctionComponent = () => (
  <IonPage>
    <IonTabs>
      <IonRouterOutlet>
        {sources.map(({ path, title, component: Component }) => (
          <Route
            key={title}
            path={`/:tab(${path})`}
            render={(props: any) => (
              <Component {...props} title={title} path={path} />
            )}
          />
        ))}
        <Route
          path="/"
          render={() => <Redirect to={`/${sources[0].path}`} />}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        {sources.map(({ path, icon, src }) => (
          <IonTabButton
            key={path}
            className={path}
            tab={path}
            href={`/${path}`}
          >
            <IonIcon {...(icon ? { icon } : { src })} />
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  </IonPage>
)

export default Tabs
