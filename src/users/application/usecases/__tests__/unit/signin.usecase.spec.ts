import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { SignInUseCase } from '../../signin.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials'

describe('SignInUseCase unit test', () => {
  let sut: SignInUseCase
  let repository: UserInMemoryRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SignInUseCase(repository, hashProvider)
  })

  it('should authenticate a user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail')
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'test@test.com', password: hashPassword }),
    )

    repository.items = [entity]

    const result = await sut.execute({
      email: 'test@test.com',
      password: '1234',
    })

    expect(spyFindByEmail).toHaveBeenCalled()
    expect(result).toStrictEqual(entity.toJSON())
  })

  it('should throw error when email is not provided', async () => {
    const props = UserDataBuilder({ email: '' })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when password is not provided', async () => {
    const props = UserDataBuilder({ password: '' })
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when email not found', async () => {
    const props = { email: 'a@a.com', password: '1234' }
    await expect(sut.execute(props)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw error when authenticate a user with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'test@test.com', password: hashPassword }),
    )

    repository.items = [entity]

    const props = {
      email: 'test@test.com',
      password: '12345',
    }

    await expect(sut.execute(props)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
