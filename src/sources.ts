import { logoHackernews, logoGithub } from 'ionicons/icons'

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
    src: require('./icons/devto.svg'),
    title: 'DEV Community',
  },
  {
    path: 'echojs',
    component: TabContent,
    src: require('./icons/echojs.svg'),
    title: 'Echo JS',
  },
  {
    path: 'reddit',
    component: TabContent,
    src: require('./icons/reddit.svg'),
    title: 'Reddit: Programming',
  },
  {
    path: 'medium',
    component: TabContent,
    src: require('./icons/medium.svg'),
    title: 'Medium',
  },
  {
    path: 'producthunt',
    component: TabContent,
    src: require('./icons/producthunt.svg'),
    title: 'Product Hunt',
  },
]

export default sources
