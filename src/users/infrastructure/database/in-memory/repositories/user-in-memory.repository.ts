import { ConflictError } from '@/shared/domain/error/conflict-error'
import { NotFoundError } from '@/shared/domain/error/not-found-error'
import { InMemorySearcheableRepository } from '@/shared/domain/repositories/in-memory-searcheable.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'

export class UserInMemoryRepository
  extends InMemorySearcheableRepository<UserEntity>
  implements UserRepository
{
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
}
