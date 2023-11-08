import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { PrismaClient, User } from '@prisma/client'
import { execSync } from 'node:child_process'
import { UserModelMapper } from '../../user-model.mapper'
import { ValidationError } from '@/shared/domain/error/validation-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('UserModelMapper integration tests', () => {
  let prismaClient: PrismaClient
  let props: any

  beforeAll(async () => {
    setupPrismaTests()
    prismaClient = new PrismaService()
    await prismaClient.$connect()
  })

  beforeEach(async () => {
    await prismaClient.user.deleteMany()
    props = {
      id: 'c9b90968-6625-4c47-848a-36357bb06271',
      name: 'any_name',
      email: 'any_email@test.com',
      password: 'any_password',
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaClient.$disconnect()
  })

  it('should throws error when user model is invalid', () => {
    const model: User = Object.assign(props, { name: null })
    expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError)
  })

  it('should convert a user model to a user entity', async () => {
    const model: User = await prismaClient.user.create({
      data: props,
    })

    const sut = UserModelMapper.toEntity(model)

    expect(sut).toBeInstanceOf(UserEntity)
    // expect(sut.toJSON()).toStrictEqual(props)
  })
})
