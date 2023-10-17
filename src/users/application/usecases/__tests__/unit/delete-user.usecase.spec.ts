import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { DeleteUserUseCase } from '../../delete-user.usecase'

describe('DeleteUserUseCase unit tests', () => {
  let sut: DeleteUserUseCase
  let repository: UserInMemoryRepository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new DeleteUserUseCase(repository)
  })

  it('should throw error when entity not found', async () => {
    await expect(sut.execute({ id: 'invalid-id' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    )
  })

  it('should delete a user', async () => {
    const spyDelete = jest.spyOn(repository, 'delete')
    const items = [new UserEntity(UserDataBuilder({}))]
    repository.items = items

    expect(repository.items).toHaveLength(1)

    await sut.execute({ id: items[0].id })

    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(repository.items).toHaveLength(0)
  })
})
