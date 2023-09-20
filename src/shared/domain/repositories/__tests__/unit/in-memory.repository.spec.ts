import { Entity } from '@/shared/domain/entities/entity'
import { InMemoryRepository } from '../../in-memory.repository'
import { NotFoundError } from '@/shared/domain/error/not-found-error'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}
class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository

  beforeEach(() => {
    sut = new StubInMemoryRepository()
  })

  it('should inserts a new entity', async () => {
    const entity = new StubEntity({ name: 'any_name', price: 10 })
    await sut.insert(entity)

    expect(sut.items).toStrictEqual([entity])
    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })

  it('should throw error when entity not found', async () => {
    await expect(sut.findById('invalid_id')).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('should find an entity by id', async () => {
    const entity = new StubEntity({ name: 'any_name', price: 10 })
    await sut.insert(entity)

    const result = await sut.findById(entity.id)

    expect(result).toStrictEqual(entity)
  })

  it('should find all entities', async () => {
    const entity = new StubEntity({ name: 'any_name', price: 10 })
    const entity2 = new StubEntity({ name: 'any_name', price: 10 })

    await sut.insert(entity)
    await sut.insert(entity2)

    const result = await sut.findAll()

    expect(result).toStrictEqual([entity, entity2])
  })
})
