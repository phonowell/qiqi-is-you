import $ from 'fire-keeper'

// function

const getId = async (): Promise<number> => {

  type Pkg = {
    activity: {
      id: number
      title: string
    }
  }

  const pkg = await $.read_('./package.json') as Pkg
  return pkg.activity.id
}

const main = async (): Promise<void> => {

  await $.exec_([
    'npm run alice build',
    'npm run build',
    'npm run alice end',
    `activity push ${await getId()} build`,
  ])
}

// export
export default main