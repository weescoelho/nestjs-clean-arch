import { PrismaClient } from '@prisma/client'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { UpdatePasswordUseCase } from '../../update-password.usecase'
import { ConflictError } from '@/shared/domain/error/conflict-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

describe('UpdatePasswordUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UpdatePasswordUseCase
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
    sut = new UpdatePasswordUseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws error when a entity found by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'test@test.com' }))

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: 'old_password',
        password: 'new_password',
      }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throws error when old password is not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'test@test.com' }))

    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: '',
        password: 'new_password',
      }),
    ).rejects.toBeInstanceOf(InvalidPasswordError)
  })

  it('should throws error when password is not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'test@test.com' }))

    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await expect(() =>
      sut.execute({
        id: entity.id,
        oldPassword: 'old_password',
        password: '',
      }),
    ).rejects.toBeInstanceOf(InvalidPasswordError)
  })

  it('should throws error when password is not provided', async () => {
    const oldPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(
      UserDataBuilder({ email: 'test@test.com', password: oldPassword }),
    )

    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({
      id: entity.id,
      oldPassword: '1234',
      password: 'new_password',
    })

    const result = await hashProvider.compareHash(
      'new_password',
      output.password,
    )

    expect(result).toBeTruthy()
  })
})
