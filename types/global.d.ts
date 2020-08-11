export {}

declare global {
  interface Window {
    [key: string]: any
  }

  interface IFeed {
    id: string
    title: string
    name: string
    type: string
    color: string
    description: string
    contentType: string
    icon: string
    subscribers: number
    bundle: any[]
    paginationType: string
    flags: {
      latest: boolean
      popular: boolean
      display: {
        comments: boolean
        votes: boolean
        author: boolean
        views: boolean
      }
    }
    categories: string[]
    subsources: string[]
    iconSVG?: string
    updatedAt?: number
    data?: IArticle[]
  }

  interface ITag {
    stats: {
      popularity: number
    }
    children: ITag[]
    approved: boolean
    type: string
    root: boolean
    _id: string
    displayName: string
    name: string
    __v?: number
  }

  interface IShowPopover {
    open: boolean
    event: Event | undefined
  }

  interface IArticle {
    _id: string
    source: {
      name: string
      id: string
      authorUrl: string
      authorName: string
      userId: string
      sourceUrl: string
      targetUrl: string
      likesCount: number
      createdAt: string
      originalFeed: any
      absoluteUrl: string
      commentsCount: number
      subsources?: any[]
      username: string
    }
    image: {
      normal: string
      big: string
      small: string
      dimensions: object
    }
    flags: {
      iframe: {
        checked: boolean
        supported: boolean
      }
      promoted: boolean
    }
    title: string
    description: string
    url: {
      panda: string
      social: string
      target: string
    }
    uniqueid: string
  }
}
