import {
  IonIcon,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react'
import React from 'react'
import { Route } from 'react-router'
import sources from '../sources'

const { path: path0, title: title0, component: Component0 } = sources[0]

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
          exact={true}
          path="/"
          render={(props: any) => (
            <Component0 {...props} title={title0} path={path0} />
          )}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        {sources.map(({ path, title, icon, src }) => (
          <IonTabButton
            key={path}
            className={path}
            tab={path}
            href={`/${path}`}
            selected={window.location.pathname === '/' && path === path0}
          >
            <IonIcon title={title} {...(icon ? { icon } : { src })} />
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  </IonPage>
)

export default React.memo(Tabs)
