import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { SignUpUseCase } from '../../signup.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { ConflictError } from '@/shared/domain/error/conflict-error'
import { BadRequestError } from '@/users/application/errors/bad-request-error'

describe('SignUpUseCase unit test', () => {
  let sut: SignUpUseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SignUpUseCase(repository, hashProvider)
  })

  it('should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = UserDataBuilder({})

    const result = await sut.execute(props)

    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalled()
  })

  it('should  not be able to register with same email twice', async () => {
    const props = UserDataBuilder({ email: 'email@email.com' })
    await sut.execute(props)

    await expect(sut.execute(props)).rejects.toThrowError(
      new ConflictError('Email already exists'),
    )
  })

  it('should throw error when name is not provided', async () => {
    const props = UserDataBuilder({ name: '' })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when email is not provided', async () => {
    const props = UserDataBuilder({ email: '' })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when password is not provided', async () => {
    const props = UserDataBuilder({ password: '' })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })
})
