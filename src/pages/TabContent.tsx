import React from 'react'
import { RouteComponentProps } from 'react-router'
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonItem,
  IonLabel,
  IonToolbar,
  IonAvatar,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButtons,
  IonMenuButton,
} from '@ionic/react'
import { arrowDropup, chatboxes } from 'ionicons/icons'

type Props = RouteComponentProps<{}> & {
  path: string
  title: string
}

const TabContent: React.FunctionComponent<Props> = ({ path, title }) => (
  <>
    <IonHeader>
      <IonToolbar className={path}>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      {[15, 22, 30, 74, 32, 67, 12, 23, 26, 78, 43, 55, 245].map((x) => (
        <IonCard key={x} className={path}>
          <IonCardHeader className="p-0">
            <IonItem
              button
              onClick={() =>
                window.open('https://himalay.com.np/about', '_system')
              }
              lines="none"
            >
              <IonAvatar className="favicon" slot="start">
                <img
                  alt="himalay.com.np"
                  src="https://www.google.com/s2/favicons?domain=https://himalay.com.np/about"
                />
              </IonAvatar>

              <IonLabel className="item-text">
                <h2>
                  Multi-line {x} text that should wrap when it is too long
                </h2>
                <p>It is too long to fit on one line in the item.</p>
              </IonLabel>
            </IonItem>
          </IonCardHeader>

          <IonCardContent className="item-footer">
            <a
              className="sub-link"
              href="https://google.com"
              target="_system"
              rel="noopener noreferrer"
            >
              300<IonIcon icon={arrowDropup.md}></IonIcon>
            </a>
            <a
              className="sub-link"
              href="https://google.com"
              target="_system"
              rel="noopener noreferrer"
            >
              10
              <IonIcon
                style={{ marginLeft: '.15em' }}
                icon={chatboxes}
              ></IonIcon>
            </a>{' '}
            an hour ago by{' '}
            <a
              className="sub-link"
              href="https://google.com"
              target="_system"
              rel="noopener noreferrer"
            >
              username
            </a>
          </IonCardContent>
        </IonCard>
      ))}
    </IonContent>
  </>
)

export default React.memo(TabContent)
