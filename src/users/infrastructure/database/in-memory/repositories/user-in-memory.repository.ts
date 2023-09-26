import { ConflictError } from '@/shared/domain/error/conflict-error'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { InMemorySearcheableRepository } from '@/shared/domain/repositories/in-memory-searcheable.repository'
import { SortDirection } from '@/shared/domain/repositories/searcheable-repository-contracts'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'

export class UserInMemoryRepository
  extends InMemorySearcheableRepository<UserEntity>
  implements UserRepository.Repository
{
  sortableFields: string[] = ['name', 'createdAt']

  async findByEmail(email: string): Promise<UserEntity> {
    const entity = this.items.find(user => user.email === email)
    if (!entity)
      throw new NotFoundError(`Entity not found using email ${email}`)

    return entity
  }

  async emailExists(email: string): Promise<void> {
    const user = await this.findByEmail(email)
    if (user) throw new ConflictError('Email already exists')
  }

  protected async applyFilter(
    items: UserEntity[],
    filter: UserRepository.Filter,
  ): Promise<UserEntity[]> {
    if (!filter) return items

    return items.filter(item =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  protected async applySort(
    items: UserEntity[],
    sort: string,
    sortDir: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir)
  }
}
