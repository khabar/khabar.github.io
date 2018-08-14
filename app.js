;(function () {
  const $ = selector => document.querySelector(selector)
  const $container = $('#container')
  const $toggleTheme = $('#toggleTheme')
  const apiURL = 'https://cors-anywhere.herokuapp.com/cdnapi.pnd.gs/v2/feeds?limit=20&page=1&sort=popular&sources='
  const sources = ['hackerNews', 'github', 'medium', 'redditprogramming', 'productHunt', 'echojs', 'csstricks', 'sidebar']
  // const rss = ['https://api.usepanda.com/v2/feeds/5b72a4e8ca168f2e0027c587/data']
  let startCoords = {}
  let direction = undefined
  let pageIndex = 0
  let pageCount = 0
  let hScrollSize = 0

  if (localStorage.getItem('light') === 'true') toggleTheme()

  $toggleTheme.addEventListener('click', toggleTheme)
  document.addEventListener('touchstart', touchStartHandler)
  document.addEventListener('touchmove', touchMoveHandler)
  document.addEventListener('touchend', touchEndHandler)
  window.addEventListener('resize', winResizeHandler)

  sources.map(src => {
    let list = `
    <div class="card"><h2 class="title">
    ${camelCaseToTitleCase(src)}
    </h2><ul class="list">
    `

    fetch(apiURL + src)
      .then(res => res.json())
      .then(json => {
        json.map(({ source: x, description, title }) => {
          list += `
          <li class="item">
          <a class="url" href="${x.absoluteUrl}" target="_blank">${title}</a>
          <span class="description">${description}</span>
          <small class="footer">
          ${x.likesCount && `<span class="point">${x.likesCount}</span> points | `}
          ${timeAgo(x.createdAt)}
          ${
            x.authorUrl
            && ` by <a class="author-url" href="${x.authorUrl}" target="_blank">
            ${(x.authorName ? x.authorName : x.authorUrl.split('/').pop())}
            </a></small></li>`
          }
          `
        })

        list += '</ul></div>'

        $container.innerHTML += list
        pageCount++
      })
  })

  hScrollSize = parseInt(getComputedStyle($container).width) + 10

  function camelCaseToTitleCase (camelCase) {
    if (camelCase == null || camelCase == '') {
      return camelCase
    }

    camelCase = camelCase.trim()
    let newText = ''
    for (let i = 0; i < camelCase.length; i++) {
      if (/[A-Z]/.test(camelCase[i]) &&
        i != 0 &&
        /[a-z]/.test(camelCase[i - 1])) {
        newText += ' '
      }
      if (i == 0 && /[a-z]/.test(camelCase[i])) {
        newText += camelCase[i].toUpperCase()
      } else {
        newText += camelCase[i]
      }
    }

    return newText
  }

  function toggleTheme (e) {
    document.body.classList.toggle('light')
    localStorage.setItem('light', document.body.className.indexOf('light') != -1)
    e && e.preventDefault()
  }

  function timeAgo (datetime) {
    const ts = {
      prefix: '',
      suffix: ' ago',
      seconds: 'less than a minute',
      minute: 'about a minute',
      minutes: '%d minutes',
      hour: 'about an hour',
      hours: 'about %d hours',
      day: 'a day',
      days: '%d days',
      month: 'about a month',
      months: '%d months',
      year: 'about a year',
      years: '%d years'
    }
    const t = (x, y) => ts[x] && ts[x].replace(/%d/i, Math.abs(Math.round(y)))

    const timer = time => {
      if (!time) return
      time = time.replace(/\.\d+/, '') // remove milliseconds
      time = time.replace(/-/, '/').replace(/-/, '/')
      time = time.replace(/T/, ' ').replace(/Z/, ' UTC')
      time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2'); // -04:00 -> -0400
      time = new Date(time * 1000 || time)

      const now = new Date()
      const seconds = ((now.getTime() - time) * .001) >> 0
      const minutes = seconds / 60
      const hours = minutes / 60
      const days = hours / 24
      const years = days / 365

      return ts.prefix + (
        seconds < 45 && t('seconds', seconds)
        || seconds < 90 && t('minute', 1)
        || minutes < 45 && t('minutes', minutes)
        || minutes < 90 && t('hour', 1)
        || hours < 24 && t('hours', hours)
        || hours < 42 && t('day', 1)
        || days < 30 && t('days', days)
        || days < 45 && t('month', 1)
        || days < 365 && t('months', days / 30)
        || years < 1.5 && t('year', 1)
        || t('years', years)
      ) + ts.suffix
    }
    return timer(datetime)
  }

  function touchStartHandler (e) {
    startCoords.x = e.touches[0].clientX
    startCoords.y = e.touches[0].clientY
  }

  function touchMoveHandler (e) {
    if (!startCoords.x || !startCoords.y) return

    const xDiff = startCoords.x - e.touches[0].clientX
    const yDiff = startCoords.y - e.touches[0].clientY

    direction = Math.abs(xDiff) > Math.abs(yDiff)
      ? xDiff > 0 ? 'left' : 'right'
      : yDiff > 0 ? 'up' : 'down'

    startCoords = {}
  }

  function touchEndHandler(e) {
    if (direction === 'left' && pageIndex < pageCount) scrollLeft(++pageIndex)
    if (direction === 'right' && pageIndex) scrollLeft(--pageIndex)

    direction = undefined
  }

  function scrollLeft(pageIndex) {
    setTimeout(() => {
      $container.scrollLeft = hScrollSize * pageIndex
    }, 500)
  }

  function winResizeHandler(e) {
    hScrollSize = parseInt(getComputedStyle($container).width) + 10
  }
})()
