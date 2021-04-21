// interface

type ItemRaw = {
  type: string
  x: number
  y: number
}

// variable

const listLeftValid = [
  'KLEE',
  'QIQI',
  'ROCK',
  'TEXT',
  'WATER',
]

const listRightValid = [
  'FLOAT',
  'PUSH',
  'SINK',
  'STOP',
  'WIN',
  'YOU',
]

const listValid = [
  ...listLeftValid,
  ...listLeftValid.map(it => it.toLowerCase()),
  ...listRightValid,
  'IS',
]

// function

class Item {

  id = ''
  type: string
  x: number
  y: number

  constructor(
    data: ItemRaw,
  ) {
    this.id = Item.makeId()
    this.type = data.type
    this.x = data.x
    this.y = data.y
  }

  static makeId(): string {
    return Math.random()
      .toString(36)
      .slice(-8)
  }

  hasStatus(
    status: string,
    mapRule: Map<string, Set<string>>,
  ): boolean {

    if (status === 'text' && this.isText()) return true

    const type = this.isText()
      ? 'text'
      : this.type

    const setRule = mapRule.get(type)
    if (!setRule) return false

    return setRule.has(status)
  }

  isLeft(): boolean {
    return listLeftValid.includes(this.type)
  }

  isRight(): boolean {
    return listRightValid.includes(this.type)
  }

  isText(): boolean {
    return this.type[0].toUpperCase() === this.type[0]
  }

  listStatus(
    mapRule: Map<string, Set<string>>,
  ): string[] {

    const listStatus: string[] = []
    if (this.isText()) listStatus.push('text')

    const type = this.isText()
      ? 'text'
      : this.type

    const setRule = mapRule.get(type)
    if (!setRule) return listStatus
    return [...new Set([...listStatus, ...setRule])]
  }

  update(
    data: Partial<ItemRaw>,
  ): Item {
    Object.assign(this, data)
    return this
  }
}

// export
export type { ItemRaw }
export { listValid, listLeftValid, listRightValid }
export default Item