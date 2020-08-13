import React from 'react'
import { IonCard, IonCardHeader, IonItem, IonIcon, IonAvatar, IonLabel, IonCardContent } from '@ionic/react'
import { caretUp, chatbubble } from 'ionicons/icons'
import { Plugins } from '@capacitor/core'

import timeAgo from '../utils/timeAgo'

const openUrl = (url: string) => async () => {
  await Plugins.Browser.open({ url })
}

const Card: React.FC<{ article: IArticle }> = ({ article }) => (
  <IonCard>
    {article.image.normal ? (
      <>
        <button className="img-btn" onClick={openUrl(article.source.targetUrl)}>
          <img
            className="card-img"
            alt={article.title || article.source.authorName || 'x'}
            src={article.image.normal}
          />
        </button>

        <IonLabel className="item-text text-left">
          <h2>{article.title}</h2>
          <p>{article.description}</p>
        </IonLabel>
      </>
    ) : (
      <IonCardHeader className="p-0">
        <IonItem detail={false} button onClick={openUrl(article.source.targetUrl)} lines="none">
          <IonAvatar className="favicon" slot="start">
            <img
              alt={article.source.name}
              src={`https://www.google.com/s2/favicons?domain=${article.source.targetUrl}`}
            />
          </IonAvatar>

          <IonLabel className="item-text">
            <h2>{article.title}</h2>
            <p>{article.description}</p>
          </IonLabel>
        </IonItem>
      </IonCardHeader>
    )}
    <IonCardContent className="item-footer">
      <a className="sub-link" href={article.source.sourceUrl} target="_system" rel="noopener noreferrer">
        {article.source.likesCount}
        <IonIcon title="Up-votes" icon={caretUp} className="up-arrow" />
        {article.source.commentsCount}
        <IonIcon title="Comments" style={{ marginLeft: '.15em' }} icon={chatbubble} />
      </a>
      {` ${timeAgo(article.source.createdAt)} by `}
      <a
        className="sub-link"
        href={
          ['reddit', 'redditprogramming'].includes('segment')
            ? `https://reddit.com/u/${article.source.username}`
            : article.source.authorUrl
        }
        target="_system"
        rel="noopener noreferrer"
      >
        {article.source.authorName || article.source.username}
      </a>
    </IonCardContent>
  </IonCard>
)

export default Card
