import { SortDirection } from '@/shared/domain/repositories/searcheable-repository-contracts'

export type SearchInput<Filter = string> = {
  page?: number
  perPage?: number
  sort?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}
