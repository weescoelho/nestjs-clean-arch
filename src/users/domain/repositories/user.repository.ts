import { UserEntity } from '../entities/user.entity'
import { SearcheableRepositoryInterface } from '@/shared/domain/repositories/searcheable-repository-contracts'

export interface UserRepository
  extends SearcheableRepositoryInterface<UserEntity, any, any> {
  findByEmail(email: string): Promise<UserEntity>
  emailExists(email: string): Promise<void>
}
