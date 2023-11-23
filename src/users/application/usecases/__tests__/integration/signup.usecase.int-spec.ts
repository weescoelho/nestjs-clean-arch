import { PrismaClient } from '@prisma/client'
import { SignUpUseCase } from '../../signup.usecase'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash-provider'

describe('SignUpUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: SignUpUseCase
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
    sut = new SignUpUseCase(repository, hashProvider)
    await prismaService.user.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should create a user', async () => {
    const props = {
      name: 'any_name',
      email: 'email@email.com',
      password: 'any_password',
    }

    const output = await sut.execute(props)
    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeInstanceOf(Date)
  })
})
