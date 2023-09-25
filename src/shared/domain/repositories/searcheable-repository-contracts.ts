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

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[]
  total: number
  currentPage: number
  perPage: number
  sort: string | null
  filter: Filter | null
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
      this.sortDir = 'asc'
    }

    this._sort = `${field}`
    this.sortDir = dir as SortDirection
  }

  get sortDir(): SortDirection | null {
    return this._sortDir
  }

  private set sortDir(value: string | null) {
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

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[]
  readonly total: number
  readonly currentPage: number
  readonly perPage: number
  readonly lastPage: number
  readonly sort: string | null
  readonly filter: Filter | null

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items
    this.total = props.total
    this.currentPage = props.currentPage
    this.perPage = props.perPage
    this.lastPage = Math.ceil(this.total / this.perPage)
    this.sort = props.sort ?? null
    this.filter = props.filter ?? null
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map(item => item.toJSON()) : this.items,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      filter: this.filter,
    }
  }
}

export interface SearcheableRepositoryInterface<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams,
  SearchOutput = SearchResult<E, Filter>,
> extends RepositoryInterface<E> {
  sortableFields: string[]
  search(searchInput: SearchInput): Promise<SearchOutput>
}
