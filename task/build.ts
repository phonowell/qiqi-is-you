import $ from 'fire-keeper'

// function

const main = async (): Promise<void> => {
  await $.compile_([
    './src/**/*.styl',
    '!**/include/**/*',
  ])
}

// export
export default main