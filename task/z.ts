import $ from 'fire-keeper'

// function

const main = async (): Promise<void> => {
  await $.sleep_(20)

  const a = new Map()
  const b = { b: 'b???' }
  a.set('b', b)

  console.log(a.get('b') === b)
}

// export
export default main