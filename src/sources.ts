import { logoHackernews, logoGithub } from 'ionicons/icons'

import devto from './icons/devto.svg'
import echojs from './icons/echojs.svg'
import reddit from './icons/reddit.svg'
import redditprogramming from './icons/redditprogramming.svg'
import medium from './icons/medium.svg'
import producthunt from './icons/producthunt.svg'
import datatau from './icons/datatau.svg'
import growthhackers from './icons/growthhackers.svg'
import TabContent from './pages/TabContent'

const sources = [
  {
    path: 'hackernews',
    icon: logoHackernews,
    title: 'Hacker News',
  },
  {
    path: 'github',
    icon: logoGithub,
    title: 'GitHub Trending',
  },
  {
    path: 'reddit',
    src: reddit,
    title: 'Reddit',
  },
  {
    path: 'devto',
    src: devto,
    title: 'DEV Community',
  },
  {
    path: 'echojs',
    src: echojs,
    title: 'Echo JS',
  },
  {
    path: 'redditprogramming',
    src: redditprogramming,
    title: 'Reddit: Programming',
  },
  {
    path: 'datatau',
    src: datatau,
    title: 'DataTau',
  },
  {
    path: 'medium',
    src: medium,
    title: 'Medium',
  },
  {
    path: 'growthhackers',
    src: growthhackers,
    title: 'GrowthHackers',
  },
  {
    path: 'producthunt',
    src: producthunt,
    title: 'Product Hunt',
  },
]

export default sources
