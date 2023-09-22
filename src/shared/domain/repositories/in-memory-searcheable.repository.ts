import { Entity } from '../entities/entity'
import { SearcheableRepositoryInterface } from './searcheable-repository-contracts'
import { InMemoryRepository } from './in-memory.repository'

export abstract class InMemorySearcheableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearcheableRepositoryInterface<E, any, any>
{
  async search(searchInput: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
