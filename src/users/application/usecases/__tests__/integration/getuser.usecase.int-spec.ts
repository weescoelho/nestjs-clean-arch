import { PrismaClient } from '@prisma/client'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { GetUserUseCase } from '../../getuser.usecase'

describe('GetUserUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: GetUserUseCase
  let repository: UserPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    repository = new UserPrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new GetUserUseCase(repository)
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

  it('should returns a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({ id: newUser.id })
    expect(output).toMatchObject(newUser)
  })
})
