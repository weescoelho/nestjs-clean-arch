import { PrismaClient } from '@prisma/client'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { SignInUseCase } from '../../signin.usecase'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('SignInUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: SignInUseCase
  let repository: UserPrismaRepository
  let module: TestingModule
  let hashProvider: HashProvider

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    repository = new UserPrismaRepository(prismaService as any)
    hashProvider = new BcryptjsHashProvider()
  })

  beforeEach(async () => {
    sut = new SignInUseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should not be able to auth with wrong email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'test@test.com' }))

    await expect(() =>
      sut.execute({
        email: entity.email,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should not be able to auth with wrong password', async () => {
    const password = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'test@test.com', password }),
    )

    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        email: 'test@test.com',
        password: 'fake',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throws error when email not provided', async () => {
    await expect(() =>
      sut.execute({
        email: null,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throws error when password not provided', async () => {
    await expect(() =>
      sut.execute({
        email: 'email@email.com',
        password: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should auth a user', async () => {
    const password = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'test@test.com', password: password }),
    )

    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({
      password: '1234',
      email: 'test@test.com',
    })

    expect(output).toMatchObject(entity.toJSON())
  })
})
