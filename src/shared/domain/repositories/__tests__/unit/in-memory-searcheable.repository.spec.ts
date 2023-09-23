import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearcheableRepository } from '../../in-memory-searcheable.repository'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}
class StubInMemoryRepository extends InMemorySearcheableRepository<StubEntity> {
  sortableFields: string[] = ['name']

  protected async applyFilter(items: StubEntity[], filter: string | null) {
    if (!filter) return items
    return items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }
}

describe('InMemorySearcheableRepository unit tests', () => {
  let sut: StubInMemoryRepository

  beforeEach(() => {
    sut = new StubInMemoryRepository()
  })

  describe('applyFilter method', () => {
    it('should  no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'test1', price: 10 })]
      const spyFilterMethod = jest.spyOn(items, 'filter')

      const result = await sut['applyFilter'](items, null)
      expect(result).toStrictEqual(items)

      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 10 }),
        new StubEntity({ name: 'TEST', price: 10 }),
        new StubEntity({ name: 'fake', price: 10 }),
      ]
      const spyFilterMethod = jest.spyOn(items, 'filter')

      let result = await sut['applyFilter'](items, 'TEST')

      expect(result).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      result = await sut['applyFilter'](items, 'test')

      expect(result).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)

      result = await sut['applyFilter'](items, 'any_name')

      expect(result).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
    })
  })

  describe('applySort method', () => {
    it('should no sort items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'b', price: 10 }),
        ,
      ]

      let result = await sut['applySort'](items, null)
      expect(result).toStrictEqual(result)

      result = await sut['applySort'](items, 'price:asc')
      expect(result).toStrictEqual(result)
    })

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'c', price: 10 }),
      ]

      let result = await sut['applySort'](items, 'name:asc')
      expect(result).toStrictEqual([items[1], items[0], items[2]])

      result = await sut['applySort'](items, 'name:desc')
      expect(result).toStrictEqual([items[2], items[0], items[1]])
    })
  })

  describe('applyPaginate method', () => {})

  describe('search method', () => {})
})
