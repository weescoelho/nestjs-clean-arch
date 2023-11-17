import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserRepository } from '@/users/domain/repositories/user.repository'

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: UserPrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()

    //Criando um módulo especifico para testes
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
  })

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any)
    await prismaService.user.deleteMany()
  })

  it('should throws error when entity not found', () => {
    expect(() => sut.findById('fake_id')).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should finds a entity by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    })

    const output = await sut.findById(newUser.id)
    expect(output.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should inserts a entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    const output = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    })

    expect(output).toStrictEqual(entity.toJSON())
  })

  it('should return all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}))

    await prismaService.user.create({
      data: entity.toJSON(),
    })

    const entities = await sut.findAll()
    expect(entities).toHaveLength(1)
    entities.map(item => expect(item.toJSON()).toStrictEqual(entity.toJSON()))
  })

  describe('Search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date()
      const entities: UserEntity[] = []

      const arrange = Array(16).fill(UserDataBuilder({}))
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            name: `User${index}`,
            email: `test${index}@mail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        )
      })

      await prismaService.user.createMany({
        data: entities.map(entity => entity.toJSON()),
      })

      const searchOutput = await sut.search(new UserRepository.SearchParams({}))

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult)
      expect(searchOutput.total).toBe(16)
      searchOutput.items.forEach((item, index) => {
        expect(item).toBeInstanceOf(UserEntity)
      })
      expect(searchOutput.items.length).toBe(15)
    })
  })
})
