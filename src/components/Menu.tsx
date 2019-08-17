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
  IonIcon,
} from '@ionic/react'
import { RouteComponentProps, withRouter } from 'react-router'

type Props = RouteComponentProps<{}>

const Menu: React.FunctionComponent<Props> = ({ history }) => (
  <IonMenu contentId="main" side="start">
    <IonHeader>
      <IonToolbar>
        <IonThumbnail className="menu-logo" slot="start">
          <IonIcon src={require('../icons/logo.svg')} />
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
