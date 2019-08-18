import { logoHackernews, logoGithub } from 'ionicons/icons'

import devto from './icons/devto.svg'
import echojs from './icons/echojs.svg'
import reddit from './icons/reddit.svg'
import medium from './icons/medium.svg'
import producthunt from './icons/producthunt.svg'
import TabContent from './pages/TabContent'

const sources = [
  {
    path: 'hackernews',
    component: TabContent,
    icon: logoHackernews,
    title: 'Hacker News',
  },
  {
    path: 'github',
    component: TabContent,
    icon: logoGithub,
    title: 'GitHub Trending',
  },
  {
    path: 'devto',
    component: TabContent,
    src: devto,
    title: 'DEV Community',
  },
  {
    path: 'echojs',
    component: TabContent,
    src: echojs,
    title: 'Echo JS',
  },
  {
    path: 'reddit',
    component: TabContent,
    src: reddit,
    title: 'Reddit: Programming',
  },
  {
    path: 'medium',
    component: TabContent,
    src: medium,
    title: 'Medium',
  },
  {
    path: 'producthunt',
    component: TabContent,
    src: producthunt,
    title: 'Product Hunt',
  },
]

export default sources
