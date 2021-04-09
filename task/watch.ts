import $compile_ from 'fire-keeper/compile_'
import $i from 'fire-keeper/i'
import $read_ from 'fire-keeper/read_'
import $watch from 'fire-keeper/watch'
import $write_ from 'fire-keeper/write_'
import path from 'path'

// function

class Compiler {

  isBusy = false
  list: string[] = []

  constructor() {
    setInterval(() => {
      this.next()
    }, 1e3)
  }

  add(
    source: string,
  ): void {

    if (!this.list.includes(source))
      this.list.push(source)
  }

  compileStyl = async (
    source: string,
  ): Promise<void> => {

    let content = (await $read_(source) as Buffer).toString()

    if (!content.includes('include/basic')) {
      const _source = path.relative(source, './src/include/basic.styl')
        .replace('../', '')
        .replace('.styl', '')
      content = `@import '${_source}'\n\n${content.trim()}`
      $write_(source, content)
    }

    await $compile_(source)
  }

  async next(): Promise<void> {

    if (!this.list?.length) return
    if (this.isBusy) return

    this.isBusy = true

    const source = this.list.shift() as string
    if (source.endsWith('.styl')) await this.compileStyl(source)
    else await $compile_(source)

    this.isBusy = false
  }
}

const main = async (): Promise<void> => {

  // catch error
  process.on('uncaughtException', (e) => $i(e.stack))

  const compiler = new Compiler()

  $watch([
    './src/**/*.styl',
    '!**/include/**/*.styl',
  ], (e: { path: string }) => compiler.add(e.path))
}

// export
export default main