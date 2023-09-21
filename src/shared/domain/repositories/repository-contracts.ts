import { Entity } from '../entities/entity'

/**
 * O Contrato define os métodos que o repositório precisa implementar.
 * Seja qual for o método de persistencia de dados, o repositório precisa implementar esses métodos.
 */

export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void>
  findById(id: string): Promise<E | null>
  findAll(): Promise<E[]>
  update(entity: E): Promise<void>
  delete(id: string): Promise<void>
}
