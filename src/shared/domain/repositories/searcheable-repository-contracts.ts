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

  constructor(props: SearchProps = {}) {
    this.page = props.page || 1
    this.perPage = props.perPage || 15
    this.sort = props.sort || null
    this.sortDir = props.sortDir || null
    this.filter = props.filter || null
  }

  get page(): number {
    return this._page
  }

  private set page(page: number) {
    let _page = Number(page)
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1
    }
    this._page = _page
  }

  get perPage(): number {
    return this._perPage
  }

  private set perPage(perPage: number) {
    let _perPage = perPage === (true as any) ? this._perPage : Number(perPage)
    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage
    }
    this._perPage = _perPage
  }

  get sort(): string | null {
    return this._sort
  }

  private set sort(sort: string | null) {
    if (
      sort === null ||
      sort === undefined ||
      sort === '' ||
      typeof sort !== 'string' ||
      sort === ' '
    ) {
      this._sort = null
      return
    }

    const [field, dir] = sort.split(':')

    if (dir !== 'asc' && dir !== 'desc') {
      this._sort = field
      this._sortDir = 'asc'
    }

    this._sort = `${field}`
    this._sortDir = dir as SortDirection
  }

  get sortDir(): SortDirection | null {
    return this._sortDir
  }

  private set sortDir(value: string | null) {
    console.log(value)
    if (!this.sort) {
      this._sortDir = null
      return
    }

    const dir = `${value}`.toLowerCase()

    if (dir !== 'asc' && dir !== 'desc') {
      this._sortDir = 'desc'
      return
    }

    this._sortDir = dir
  }

  get filter(): string | null {
    return this._filter
  }

  private set filter(filter: string | null) {
    this._filter =
      filter === null ||
      filter === undefined ||
      filter === '' ||
      filter === ' ' ||
      typeof filter === 'boolean'
        ? null
        : `${filter}`
  }
}

export interface SearcheableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(searchInput: SearchParams): Promise<SearchOutput>
}
