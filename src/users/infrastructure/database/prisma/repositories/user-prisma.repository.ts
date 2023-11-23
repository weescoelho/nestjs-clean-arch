import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserModelMapper } from '../models/user-model.mapper'

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt']

  constructor(private prismaService: PrismaService) {}

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }

  emailExists(email: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async search(
    searchInput: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    const sortable = this.sortableFields.includes(searchInput.sort) || false
    const orderByField = sortable ? searchInput.sort : 'createdAt'
    const orderByDirection = sortable ? searchInput.sortDir : 'desc'

    const count = await this.prismaService.user.count({
      ...(searchInput.filter && {
        where: {
          name: {
            contains: searchInput.filter,
            mode: 'insensitive',
          },
        },
      }),
    })

    const models = await this.prismaService.user.findMany({
      ...(searchInput.filter && {
        where: {
          name: {
            contains: searchInput.filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDirection,
      },
      skip:
        searchInput.page && searchInput.page > 0
          ? (searchInput.page - 1) * searchInput.perPage
          : 1,
      take:
        searchInput.perPage && searchInput.perPage > 0
          ? searchInput.perPage
          : 15,
    })

    return new UserRepository.SearchResult({
      items: models.map(model => UserModelMapper.toEntity(model)),
      total: count,
      currentPage: searchInput.page,
      perPage: searchInput.perPage,
      filter: searchInput.filter,
      sort: orderByField,
    })
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity.toJSON(),
    })
  }

  async findById(id: string): Promise<UserEntity> {
    return this._get(id)
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prismaService.user.findMany()
    return users.map(UserModelMapper.toEntity)
  }

  async update(entity: UserEntity): Promise<void> {
    await this._get(entity.id)
    await this.prismaService.user.update({
      where: {
        id: entity.id,
      },
      data: entity.toJSON(),
    })
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.prismaService.user.delete({
      where: {
        id,
      },
    })
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      })

      return UserModelMapper.toEntity(user)
    } catch (error) {
      throw new NotFoundError(`UserModel not found with id ${id}`)
    }
  }
}
