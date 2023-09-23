import { Entity } from '../entities/entity'
import {
  SearchParams,
  SearchResult,
  SearcheableRepositoryInterface,
} from './searcheable-repository-contracts'
import { InMemoryRepository } from './in-memory.repository'

export abstract class InMemorySearcheableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearcheableRepositoryInterface<E, any, any>
{
  sortableFields: string[] = []

  async search(searchInput: SearchParams): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, searchInput.filter)
    const itemsSorted = await this.applySort(itemsFiltered, searchInput.sort)
    const itemsPaginated = await this.applyPaginate(
      itemsSorted,
      searchInput.page,
      searchInput.perPage,
    )
    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: searchInput.page,
      perPage: searchInput.perPage,
      sort: searchInput.sort,
      filter: searchInput.filter,
    })
  }
  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>

  protected async applySort(items: E[], sort: string | null): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) return items
    const [field, direction] = sort.split(':')

    return [...items].sort((a, b) => {
      if (a.props[field] < b.props[field]) return direction === 'asc' ? -1 : 1
      if (a.props[field] > b.props[field]) return direction === 'asc' ? 1 : -1

      return 0
    })
  }

  protected async applyPaginate(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage
    const end = start + perPage

    return items.slice(start, end)
  }
}
