import { SortDirection } from '@/shared/domain/repositories/searcheable-repository-contracts'
import { ListUsersInput } from '@/users/application/usecases/listusers.usecase'

export class ListUsersDto implements ListUsersInput {
  page?: number
  perPage?: number
  sort?: string
  sortDir?: SortDirection
  filter?: string
}
