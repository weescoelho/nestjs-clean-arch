import { UpdatePasswordUseCase } from '../../update-password.usecase'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { Hash } from 'crypto'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

describe('UpdatePasswordrUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new UpdatePasswordUseCase(repository, hashProvider)
  })

  it('should throw error when entity not found', async () => {
    await expect(
      sut.execute({
        id: 'invalid-id',
        password: 'test_password',
        oldPassword: 'test_old_password',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'))
  })

  it('should throw error when old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    repository.items = [entity]

    await expect(
      sut.execute({
        id: entity.id,
        password: 'test_password',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password not provided'),
    )
  })

  it('should throw error when new password not provided', async () => {
    const entity = new UserEntity(
      UserDataBuilder({ password: 'test_password' }),
    )

    repository.items = [entity]

    await expect(
      sut.execute({
        id: entity.id,
        password: '',
        oldPassword: 'test_password',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Old password and new password not provided'),
    )
  })

  it('should throw error when new password not provided', async () => {
    const hashPassword = await hashProvider.generateHash('test_password')
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }))

    repository.items = [entity]

    await expect(
      sut.execute({
        id: entity.id,
        password: '1234',
        oldPassword: '123456',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'))
  })

  it('should be able update a password', async () => {
    const hashPassword = await hashProvider.generateHash('test_password')
    const spyUpdate = jest.spyOn(repository, 'update')
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))]
    repository.items = items

    const result = await sut.execute({
      id: items[0].id,
      password: '1234',
      oldPassword: 'test_password',
    })

    const checkNewPassword = await hashProvider.compareHash(
      '1234',
      result.password,
    )

    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(checkNewPassword).toBe(true)
  })
})
