import Item, { ItemRaw } from './Item'

// interface

type ItemRender = ItemRaw & {
  id: string
  status: string[]
}

type Direction = 'left' | 'right' | 'top' | 'bottom'
type Size = [number, number]

// function

class Level {

  private data: Map<string, Item> = new Map()
  private rule: Map<string, Set<string>> = new Map()
  private size: Size = [0, 0]

  constructor() {
    this.resetRule()
  }

  private calcPositionClose(
    item: Item,
    direction: Direction,
  ): [number, number] {

    const x = direction === 'left'
      ? item.x - 1
      : direction === 'right'
        ? item.x + 1
        : item.x
    if (x < 0 || x > this.size[0] - 1) return [-1, -1]

    const y = direction === 'top'
      ? item.y - 1
      : direction === 'bottom'
        ? item.y + 1
        : item.y
    if (y < 0 || y > this.size[1] - 1) return [-1, -1]

    return [x, y]
  }

  private listByDirection(id: string, direction: Direction): Item[]
  private listByDirection(item: Item, direction: Direction): Item[]
  private listByDirection(
    input: string | Item,
    direction: Direction,
  ): Item[] {

    const item = this.pickItem(input)
    if (!item) return []

    let listResult: Item[] = []

    const next = (
      it: Item,
    ) => {
      const listClose = this.getClose(it, direction)
        .filter(it2 => it2.hasStatus('push', this.rule) || it2.hasStatus('stop', this.rule))
      if (!listClose.length) return

      listResult = [...listResult, ...listClose]

      const itemNext = listClose[0]
      const [x, y] = this.calcPositionClose(itemNext, direction)
      if (x < 0 || y < 0) {
        listResult.push(new Item(itemNext).update({
          type: 'stop',
        }))
        return
      }
      next(itemNext)
    }
    next(item)

    return listResult
  }

  private pickItem(
    input: string | Item,
  ): Item | undefined {
    return typeof input === 'string'
      ? this.get(input)
      : input
  }

  private resetRule() {
    this.rule.clear()
    this.rule
      .set('stop', new Set(['stop']))
      .set('text', new Set(['push']))
  }

  private updateSink(): void {

    const listSink = this.getByStatus('sink')
    if (!listSink.length) return

    listSink.forEach(item => {

      const listThere = this.getByPosition(item.x, item.y)

      const list2bSank = listThere.filter(it => !it.hasStatus('sink', this.rule) && !it.hasStatus('float', this.rule))
      if (!list2bSank.length) return

      const list2bRemoved = listThere.filter(it => !it.hasStatus('float', this.rule))

      this.remove(list2bRemoved)
    })
  }

  private updateRule(): void {

    this.resetRule()

    const listIS = this.getByType('IS')
    if (!listIS.length) return

    listIS.forEach(item => {

      ([
        ['left', 'right'],
        ['top', 'bottom'],
      ] as const).forEach(listDirection => {
        const listLeft = this.getClose(item, listDirection[0])
          .filter(it => it.isLeft())
        if (!listLeft.length) return

        const listRight = this.getClose(item, listDirection[1])
          .filter(it => it.isRight())
        if (!listRight.length) return

        listLeft.forEach(itL => listRight.forEach(itR => {
          const typeL = itL.type.toLowerCase()
          const typeR = itR.type.toLowerCase()
          const set = this.rule.get(typeL)
          if (!set) this.rule.set(typeL, new Set([typeR]))
          else set.add(typeR)
        }))
      })
    })
  }

  private updateYou(
    direction: Direction,
  ): void {
    const listYou = this.getByStatus('you')

    listYou.forEach(item => {

      const listX = this.listByDirection(item, direction)
      if (listX.filter(it => it.hasStatus('stop', this.rule)).length) return

      listX.filter(it => it.hasStatus('push', this.rule))
        .forEach(it => {
          const [x, y] = this.calcPositionClose(it, direction)
          if (x < 0 || y < 0) return
          it.update({ x, y })
        })

      const [x, y] = this.calcPositionClose(item, direction)
      if (x < 0 || y < 0) return
      item.update({ x, y })
    })
  }

  add(
    data: ItemRaw,
  ): Item {
    const item = new Item(data)
    this.data.set(item.id, item)
    this.updateRule()
    return item
  }

  filter(
    callback: (input: Item) => boolean,
  ): Item[] {
    const listItem: Item[] = []
    this.data.forEach(item => {
      if (!callback(item)) return
      listItem.push(item)
    })
    return listItem
  }

  get(
    id: string,
  ): Item | undefined {
    return this.data.get(id)
  }

  getClose(id: string, direction: Direction): Item[]
  getClose(item: Item, direction: Direction): Item[]
  getClose(
    input: string | Item,
    direction: Direction,
  ): Item[] {

    const item = this.pickItem(input)
    if (!item) return []

    switch (direction) {
      case 'left':
        return this.filter(it => it.x === item.x - 1 && it.y === item.y)
      case 'right':
        return this.filter(it => it.x === item.x + 1 && it.y === item.y)
      case 'top':
        return this.filter(it => it.x === item.x && it.y === item.y - 1)
      case 'bottom':
        return this.filter(it => it.x === item.x && it.y === item.y + 1)
      default:
        return []
    }
  }

  getByPosition(
    x: number,
    y: number,
  ): Item[] {
    return this.filter(it => it.x === x && it.y === y)
  }

  getByStatus(
    status: string,
  ): Item[] {
    return this.filter(it => it.hasStatus(status, this.rule))
  }

  getByType(
    type: string,
  ): Item[] {
    return this.filter(it => it.type === type)
  }

  load(
    list: ItemRaw[],
    size: Size,
  ): void {
    // reset
    this.size = size
    this.data.clear()
    // set
    list.forEach(item => this.add(item))
  }

  map<T>(
    callback: (input: Item) => T,
  ): T[] {
    const listResult: T[] = []
    this.data.forEach(item => {
      listResult.push(callback(item))
    })
    return listResult
  }

  move(
    direction: Direction,
  ): void {

    this.updateYou(direction)
    this.updateSink()

    this.updateRule()
  }

  remove(id: string): void
  remove(listId: string[]): void
  remove(item: Item): void
  remove(listItem: Item[]): void
  remove(
    input: string | string[] | Item | Item[],
  ): void {

    if (typeof input === 'string')
      this.data.delete(input)

    else if (input instanceof Item)
      this.data.delete(input.id)

    else if (input instanceof Array)
      input.forEach((ipt: string | Item) => (
        typeof ipt === 'string'
          ? this.data.delete(ipt)
          : this.data.delete(ipt.id)
      ))

    this.updateRule()
  }

  render(): ItemRender[] {
    return this.map(it => ({
      id: it.id,
      status: it.listStatus(this.rule),
      type: it.type,
      x: it.x,
      y: it.y,
    }))
  }

  renderRule(): string[] {
    const listResult: string[] = []
    this.rule.forEach((set, type) => {
      set.forEach(status => {
        listResult.push(`${type} is ${status}`.toUpperCase())
      })
    })
    return listResult
  }

  set(
    id: string,
    data: Partial<ItemRaw>,
  ): Item | undefined {

    const item = this.get(id)
    if (!item) return undefined

    const itemX = item.update(data)

    this.data.set(id, itemX)
    this.updateRule()
    return itemX
  }
}

// export
export type { ItemRender }
export default Level