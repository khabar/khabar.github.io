import React from 'react'
import { IonAvatar, IonButton, IonContent, IonItem, IonLabel, IonList } from '@ionic/react'
import { logoGithub } from 'ionicons/icons'
import { Plugins } from '@capacitor/core'

import { ReactComponent as Logo } from '../icons/logo.svg'

const openUrl = (url: string) => async () => {
  await Plugins.Browser.open({ url })
}

const resources = [
  {
    url: 'khabar.github.io',
    title: 'Progressive Web App',
    description: (
      <>
        The Web-app/PWA version of <strong>Khabar</strong> app is also available and powered by GitHub Pages.
      </>
    ),
  },
  {
    logo: logoGithub,
    url: 'github.com/khabar',
    title: 'Source Code',
    description: 'The complete source of this application is available in GitGub.',
  },
  {
    logo: 'https://usepanda.com/favicons/apple-touch-icon.png',
    url: 'usepanda.com',
    title: 'Data Source (API)',
    description:
      'Panda is freely available news reader when you can discover the best tools, resources and inspiration in the world of design and tech.',
  },
  {
    logo: 'https://ionicframework.com/img/meta/favicon-192x192.png',
    url: 'ionicframework.com',
    title: 'SDK/UI-toolkit (React)',
    description:
      'Ionic Framework is an open source UI toolkit for building cross-platform apps using web technologies.',
  },
]

const About = () => (
  <IonContent className="about text-center">
    <Logo style={{ height: '10vh', marginTop: '5vh' }} />
    <div>
      <blockquote>
        <strong>Khabar</strong> is a free and open-source cross-platform application for staying informed about the best
        tools and techniques in the world of design and technology developed by{' '}
        <IonButton className="inline-button" fill="clear" onClick={openUrl('https://himalay.com.np')}>
          Himalay Sunuwar
        </IonButton>
        .
      </blockquote>
    </div>
    <IonList style={{ marginTop: '5vh' }}>
      {resources.map(({ logo, url, title, description }) => (
        <IonItem key={title} detail={false} button={true} onClick={openUrl(`https://${url}`)}>
          <IonAvatar slot="start">{logo ? <img alt={title} src={logo} /> : <Logo />}</IonAvatar>
          <IonLabel>
            <h2>{url}</h2>
            <h3>{title}</h3>
            <p>{description}</p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  </IonContent>
)

export default About
