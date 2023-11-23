import { PrismaClient } from '@prisma/client'
import { DeleteUserUseCase } from '../../delete-user.usecase'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('DeleteUserUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: DeleteUserUseCase
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
    sut = new DeleteUserUseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throw error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'any_id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('should delete a entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    await sut.execute({ id: newUser.id })

    const output = await prismaService.user.findUnique({
      where: {
        id: newUser.id,
      },
    })
    expect(output).toBe(null)
    const models = await prismaService.user.findMany()
    expect(models).toHaveLength(0)
  })
})
