import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserInMemoryRepository } from '../../user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { ConflictError } from '@/shared/domain/error/conflict-error'

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  it('should throw error when not found - findByEmail method', async () => {
    await expect(sut.findByEmail('a@a.com')).rejects.toThrowError(
      new NotFoundError('Entity not found using email a@a.com'),
    )
  })

  it('should find a entity by email - findByEmail method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findByEmail(entity.email)
    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it('should throw error when not found - emailExists method', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    expect(sut.emailExists(entity.email)).rejects.toThrowError(
      new ConflictError('Email already exists'),
    )
  })
})
