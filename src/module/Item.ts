// interface

type ItemRaw = {
  type: string
  x: number
  y: number
}

// variable

const listLeftValid = [
  'ALL',
  'KLEE',
  'QIQI',
  'ROCK',
  'TEXT',
  'WATER',
]

const listLogicValid = [
  'IS',
]

const listRightValid = [
  'DEFEAT',
  'EMPTY',
  'HOT',
  'MELT',
  'MORE',
  'OPEN',
  'PUSH',
  'SHUT',
  'SINK',
  'STOP',
  'WEAK',
  'WIN',
  'YOU',
]

const listValid = [
  ...listLeftValid,
  ...listLeftValid.map(it => it.toLowerCase()),
  ...listLogicValid,
  ...listRightValid,
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

  private static makeId(): string {
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
    if (setRule && setRule.has(status)) return true

    const setRuleAll = mapRule.get('all')
    if (setRuleAll && setRuleAll.has(status)) return true

    return false
  }

  isLeft(): boolean {
    return listLeftValid.includes(this.type)
  }

  isLogic(): boolean {
    return listLogicValid.includes(this.type)
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