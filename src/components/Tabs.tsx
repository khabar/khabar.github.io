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
import { logoHackernews, logoGithub } from 'ionicons/icons'
import TabContent from '../pages/TabContent'

const sources = [
  {
    path: 'hacker-news',
    component: TabContent,
    icon: logoHackernews,
    title: 'Hacker News',
  },
  {
    path: 'github',
    component: TabContent,
    icon: logoGithub,
    title: 'GitHub',
  },
  {
    path: 'dev-community',
    component: TabContent,
    src: `data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" style="height:20px;width:20px"><path d="M7.4 9.9C7.2 9.7 7 9.7 6.8 9.7H6.1V14.3H6.8C7 14.3 7.2 14.3 7.4 14.2 7.5 14 7.6 13.8 7.6 13.6V10.5C7.6 10.2 7.5 10 7.4 9.9M20 2H4A2 2 0 0 0 2 4V20C2 21.1 2.9 22 4 22H20A2 2 0 0 0 22 20V4C22 2.9 21.1 2 20 2M8.9 13.6C8.9 14.4 8.4 15.7 6.7 15.7H4.7V8.3H6.8C8.4 8.3 8.9 9.6 8.9 10.4V13.6M13.4 9.6H11V11.3H12.5V12.7H11V14.4H13.4V15.7H10.6C10.1 15.7 9.7 15.3 9.7 14.8V9.2C9.7 8.7 10.1 8.3 10.6 8.3H13.4V9.6M18 14.8C17.4 16.1 16.4 15.9 15.9 14.8L14.2 8.3H15.6L17 13.4 18.3 8.3H19.7L18 14.8V14.8Z"/></svg>`,
    title: 'DEV Community',
  },
  {
    path: 'reddit',
    component: TabContent,
    src: `data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" style="height:20px;width:20px"><path d="M22 12.1C22 10.9 21 10 19.8 10 19.2 10 18.7 10.2 18.3 10.6 16.8 9.5 14.7 8.8 12.4 8.7L13.4 4 16.7 4.7C16.7 5.5 17.4 6.2 18.3 6.2 19.1 6.2 19.8 5.5 19.8 4.6 19.8 3.8 19.1 3.1 18.3 3.1 17.7 3.1 17.1 3.4 16.9 4L13.2 3.2C13.1 3.2 13 3.2 12.9 3.2 12.8 3.3 12.8 3.4 12.8 3.5L11.7 8.7C9.3 8.8 7.2 9.5 5.7 10.6 5.3 10.2 4.8 10 4.2 10 3 10 2 11 2 12.2 2 13.1 2.5 13.8 3.3 14.2 3.3 14.4 3.2 14.6 3.2 14.8 3.2 18.2 7.2 20.9 12 20.9 16.8 20.9 20.8 18.2 20.8 14.8 20.8 14.6 20.8 14.4 20.7 14.2 21.5 13.8 22 13 22 12.1M7 13.7C7 12.8 7.7 12.1 8.5 12.1 9.4 12.1 10.1 12.8 10.1 13.7A1.6 1.6 0 0 1 8.5 15.3C7.7 15.3 7 14.6 7 13.7M15.7 17.8C14.6 18.9 12.6 19 12 19 11.4 19 9.4 18.9 8.3 17.8 8.1 17.7 8.1 17.4 8.3 17.3 8.5 17.1 8.7 17.1 8.9 17.3 9.5 18 11 18.2 12 18.2 13 18.2 14.5 18 15.1 17.3 15.3 17.1 15.6 17.1 15.7 17.3 15.9 17.4 15.9 17.7 15.7 17.8M15.4 15.3C14.6 15.3 13.9 14.6 13.9 13.7A1.6 1.6 0 0 1 15.4 12.2C16.3 12.2 17 12.9 17 13.7 17 14.6 16.3 15.3 15.4 15.3Z"/></svg>`,
    title: 'Reddit',
  },
  {
    path: 'medium',
    component: TabContent,
    src: `data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" style="height:20px;width:20px"><path d="M4.4 7.3C4.4 7.1 4.3 6.8 4.1 6.7L2.3 4.4V4.1H8.1L12.5 13.9 16.5 4.1H22V4.4L20.4 5.9C20.3 6 20.2 6.2 20.2 6.4V17.6C20.2 17.8 20.3 18 20.4 18.1L22 19.6V19.9H14.1V19.6L15.7 18C15.9 17.9 15.9 17.8 15.9 17.6V8.5L11.4 19.9H10.8L5.6 8.5V16.1C5.5 16.5 5.6 16.8 5.9 17L8 19.6V19.9H2V19.6L4.1 17C4.3 16.8 4.4 16.5 4.4 16.1V7.3Z"/></svg>`,
    title: 'Medium',
  },
  {
    path: 'product-hunt',
    component: TabContent,
    src: `data:image/svg+xml;utf8,<svg viewBox="0 0 24 24">
    <path d="M13.6 8.4h-3.4V12h3.4a1.8 1.8 0 1 0 0-3.6zM12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm1.6 14.4h-3.4V18H7.8V6h5.8a4.2 4.2 0 1 1 0 8.4z"/>
  </svg>`,
    title: 'Product Hunt',
  },
]

const Tabs: React.FunctionComponent = () => (
  <IonPage>
    <IonTabs>
      <IonRouterOutlet>
        {sources.map(({ path, title, component: Component }) => (
          <Route
            key={path}
            path={`/:tab(${path})`}
            render={(props: any) => (
              <Component {...props} title={title} path={path} />
            )}
            exact
          />
        ))}
        <Route
          path="/"
          render={() => <Redirect to={`/${sources[0].path}`} />}
          exact
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        {sources.map(({ path, icon, src }) => (
          <IonTabButton
            key={`tab-${path}`}
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
