import { PrismaClient } from '@prisma/client'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdateUserUseCase } from '../../update-user.usecase'

describe('UpdateUserUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UpdateUserUseCase
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
    sut = new UpdateUserUseCase(repository)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throw error when entity not found', async () => {
    await expect(() =>
      sut.execute({ id: 'any_id', name: 'fake_name' }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should update a user', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.execute({ id: model.id, name: 'new_name' })
    expect(output.name).toBe('new_name')
  })
})
