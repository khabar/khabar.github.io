import React from 'react'
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
  IonThumbnail,
} from '@ionic/react'
import { RouteComponentProps, withRouter } from 'react-router'
import Logo from './Logo'

type Props = RouteComponentProps<{}>

const Menu: React.FunctionComponent<Props> = ({ history }) => (
  <IonMenu contentId="main" side="start">
    <IonHeader>
      <IonToolbar>
        <IonThumbnail className="menu-logo" slot="start">
          <Logo />
        </IonThumbnail>
        <IonTitle>Khabar</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonMenuToggle auto-hide="false">
          <IonItem button onClick={() => history.push('/about')}>
            About
          </IonItem>
        </IonMenuToggle>
      </IonList>
    </IonContent>
  </IonMenu>
)

export default withRouter(React.memo(Menu))
