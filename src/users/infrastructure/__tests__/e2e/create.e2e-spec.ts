import { UserRepository } from '@/users/domain/repositories/user.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { SignUpDto } from '../../dtos/signup.dto'
import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import request from 'supertest'
import { UsersController } from '../../users.controller'
import { instanceToPlain } from 'class-transformer'
import { applyGlobalConfig } from '@/global-config'

describe('Create User E2E Test', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let signUpDto: SignUpDto
  const prismaService = new PrismaClient()

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile()
    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()
    repository = module.get<UserRepository.Repository>('UserRepository')
  })

  beforeEach(async () => {
    signUpDto = {
      name: 'test name',
      email: 'test@test.com',
      password: '123456',
    }

    await prismaService.user.deleteMany()
  })

  describe('POST /users', () => {
    // it('should create a user', async () => {
    //   const res = await request(app.getHttpServer())
    //     .post('/users')
    //     .send(signUpDto)
    //     .expect(201)
    //   expect(Object.keys(res.body)).toStrictEqual([
    //     'id',
    //     'name',
    //     'email',
    //     'createdAt',
    //   ])
    //   const user = await repository.findById(res.body.id)
    //   const presenter = UsersController.userToResponse(user.toJSON())
    //   const serialized = instanceToPlain(presenter)
    //   expect(res.body).toStrictEqual(serialized)
    // })
  })
})
