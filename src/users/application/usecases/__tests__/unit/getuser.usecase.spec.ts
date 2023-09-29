import { GetUserUseCase } from '../../getuser.usecase'

import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new GetUserUseCase(repository)
  })

  it('should throw error when entity not found', async () => {
    await expect(sut.execute({ id: 'invalid-id' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('should be able to get user profile', async () => {
    const spyFindById = jest.spyOn(repository, 'findById')
    const items = [new UserEntity(UserDataBuilder({}))]
    repository.items = items

    const result = await sut.execute({ id: items[0].id })

    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(items[0].toJSON())
    expect(result).toMatchObject({
      id: items[0].id,
      name: items[0].name,
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
  })
})
