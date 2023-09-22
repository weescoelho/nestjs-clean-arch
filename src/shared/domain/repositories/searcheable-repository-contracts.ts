import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contracts'

export type SortDirection = 'asc' | 'desc'
export type SearchProps<Filter = string> = {
  page?: number
  perPage?: number
  sort?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}

export class SearchParams {
  protected _page: number
  protected _perPage = 15
  protected _sort: string | null
  protected _sortDir: SortDirection | null
  protected _filter: string | null

  constructor(props: SearchProps) {
    this._page = props.page || 1
    this._perPage = props.perPage || 15
    this._sort = props.sort || null
    this._sortDir = props.sortDir || null
    this._filter = props.filter || null
  }

  get page(): number {
    return this._page
  }

  private set page(page: number) {}

  get perPage(): number {
    return this._perPage
  }

  private set perPage(perPage: number) {}

  get sort(): string | null {
    return this._sort
  }

  private set sort(sort: string | null) {}

  get sortDir(): SortDirection | null {
    return this._sortDir
  }

  private set sortDir(sortDir: SortDirection | null) {}

  get filter(): string | null {
    return this._filter
  }

  private set filter(filter: string | null) {}
}

export interface SearcheableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(searchInput: SearchParams): Promise<SearchOutput>
}
