// function

const prevent = (
  e: Event,
): void => {

  if (!(e.target as HTMLElement).closest('.scrollable'))
    e.preventDefault()
}

const main = (
  isPrevented = true,
): void => {

  if (isPrevented) {
    Object.assign(document.body.style, {
      height: '100vh',
      overflow: 'hidden',
    })
    document.addEventListener('touchmove', prevent, {
      passive: false,
    })
  } else {
    Object.assign(document.body.style, {
      height: 'auto',
      overflow: 'auto',
    })
    document.removeEventListener('touchmove', prevent, {
      passive: false,
    } as never)
  }
}

// export
export default main