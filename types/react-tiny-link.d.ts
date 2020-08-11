declare module 'react-tiny-link' {
  import * as React from 'react'
  export enum ReactTinyLinkType {
    TYPE_AMAZON = 'TYPE_AMAZON',
    TYPE_YOUTUBE = 'TYPE_YOUTUBE',
    TYPE_AUDIO = 'TYPE_AUDIO',
    TYPE_VIDEO = 'TYPE_VIDEO',
    TYPE_IMAGE = 'TYPE_IMAGE',
    TYPE_DEFAULT = 'TYPE_DEFAULT',
    TYPE_INSTAGRAM = 'TYPE_INSTAGRAM',
    TYPE_BOARDGAMEGEEK = 'TYPE_BOARDGAMEGEEK',
    TYPE_TWITTER = 'TYPE_TWITTER',
  }
  export type CardSizeType = 'small' | 'large'
  export interface IReactTinyLinkProps {
    cardSize?: CardSizeType
    maxLine: number
    minLine: number
    url: string
    header?: string
    onError?: (error: Error) => void
    onSuccess?: (response: IReactTinyLinkData) => void
    onClick?: (e: any, response?: IReactTinyLinkData) => void
    description?: string
    showGraphic?: boolean
    autoPlay?: boolean
    width?: string | number
    proxyUrl?: string
    loadSecureUrl?: boolean
    scraper?: (
      url: string,
      httpClient: any,
      defaultMedia: any,
    ) => Promise<{
      title: any
      description: any
      url: any
      video: any[]
      image: any[]
      type: ReactTinyLinkType
    }>
    defaultMedia?: string
  }
  export interface IReactTinyLinkData {
    description: string
    image: string[]
    title: string
    type: ReactTinyLinkType
    video: string[]
    url: string
  }

  export const ScrapperWraper: (
    url: string,
    httpClient: any,
    defaultMedia: string[],
  ) => Promise<
    | {
        title: any
        content: string
        url: string
        description: any
        video: any
        image: any[]
        type: ReactTinyLinkType
      }
    | {
        title: any
        url: any
        description: any
        type: ReactTinyLinkType
        video: any[]
        image: any[]
      }
  >
  export const ReactTinyLink: React.FC<IReactTinyLinkProps>
}
