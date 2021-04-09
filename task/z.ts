import $ from 'fire-keeper'

// function

async function main(): Promise<void> {
  $.compile_([
    './src/include/other/count-down.pug',
    './src/include/other/count-down.styl',
    './src/include/other/count-down.coffee',
  ])
}

// export
export default main