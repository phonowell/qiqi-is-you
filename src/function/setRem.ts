import isMobile from 'ismobilejs'
import throttle from 'lodash/throttle'


// variable

const delay = 200
const maxWidth = 750
const rem = 100

// function

function bind(): void {

  window.addEventListener('resize', () => resize())
  window.addEventListener('orientationchange', () => resize())
  document.addEventListener('DomContentLoaded', () => resize())
}

function calc(): number {

  const Width = window.innerWidth || document.documentElement.clientWidth

  let width = Math.min(Width, maxWidth)
  if (!isMobile().any) {
    const Height = window.innerHeight || document.documentElement.clientHeight
    width = width * Height / 1334
  }
  return Math.trunc(width / (maxWidth / rem))
}

function main(): void {
  bind()
  resize()
}

const resize = throttle((): void => {

  const $el = document.documentElement
  let fontSize = calc()

  $el.style.fontSize = `${fontSize}px`

  const _fontSize = parseFloat(window.getComputedStyle($el).fontSize)

  if (_fontSize !== fontSize) {
    fontSize *= fontSize / _fontSize
    $el.style.fontSize = `${fontSize}px`
  }

}, delay, { trailing: true })

// export
export default main