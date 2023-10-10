import { UpdateUserUseCase } from '../../update-user.usecase'

import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new UpdateUserUseCase(repository)
  })

  it('should throw error when entity not found', async () => {
    await expect(
      sut.execute({ id: 'invalid-id', name: 'test_name' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'))
  })

  it('should throw error when name not provided', async () => {
    await expect(sut.execute({ id: 'invalid-id', name: '' })).rejects.toThrow(
      new BadRequestError('Name not provided'),
    )
  })

  it('should be able update a user', async () => {
    const spyFindById = jest.spyOn(repository, 'update')
    const items = [new UserEntity(UserDataBuilder({}))]
    repository.items = items

    const result = await sut.execute({ id: items[0].id, name: 'new_name' })

    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(items[0].toJSON())
    expect(result).toMatchObject({
      id: items[0].id,
      name: 'new_name',
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
  })
})
