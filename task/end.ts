import $ from 'fire-keeper'

// function

const getPkg = async () => {

  type Pkg = {
    activity: {
      id: number
      title: string
    }
  }

  const pkg = await $.read_('./package.json') as Pkg
  return {
    id: pkg.activity.id,
    title: pkg.activity.title,
  }
}

const main = async (): Promise<void> => {

  const { id, title } = await getPkg()
  if (!id) throw new Error('invalid activity id')

  if (!await validate()) throw new Error('invalid index.html')

  const path = `//activity.hdslb.com/blackboard/activity${id}`
  await replaceIndex(path, title)
  await replaceStyle(path)
}

const makeNote = (): string => {

  const message: string = [
    'Bilibili Manga Activity Project',
    '/',
    `${makeTime()} @ Mimiko`,
  ].join(' ')

  return `<!-- ${message} -->`
}

const makeTime = (): string => {
  const date: Date = new Date()
  return [
    date.getFullYear(),
    '/',
    date.getMonth() + 1,
    '/',
    date.getDate(),
    ' ',
    date.getHours(),
    ':',
    date.getMinutes().toString()
      .padStart(2, '0'),
    ':',
    date.getSeconds().toString()
      .padStart(2, '0'),
  ].join('')
}

const replaceIndex = async (
  path: string,
  title: string,
): Promise<void> => {

  const content: string = (await $.read_('./build/index.html') as string)

    // static
    .replace(/ href="/gu, ` href="${path}`)
    .replace(/ src="/gu, ` src="${path}`)

    // replace
    .replace(/<title.*?<\/title>/u, `<link rel="icon" href="//www.bilibili.com/favicon.ico"><title>${title}</title>`)

  await $.write_('./build/index.html', [
    makeNote(),
    content,
  ].join('\n'))
}

const replaceStyle = async (
  path: string,
): Promise<void> => {

  await Promise.all((await $.source_('./build/static/**/*.css')).map(
    source => (async () => {

      const content: string = await $.read_(source) as string
      if (!content.includes('url(/')) return

      const cont: string = content
        .replace(/url\(\//gu, `url(${path}/`)

      await $.write_(source, cont)
    })(),
  ))
}

const validate = async (): Promise<boolean> => {
  const content: string = await $.read_('./build/index.html') as string
  if (!content) return false
  return !content.startsWith('<!-- Bilibili Manga Activity Project')
}

// export
export default main