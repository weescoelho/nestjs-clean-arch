import { SearchResult } from '@/shared/domain/repositories/searcheable-repository-contracts'
import { PaginationOutputMapper } from '../../pagination-output'

describe('PaginationOutputMapper unit tests', () => {
  it('should convert a SearchResult  in output', () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: '',
      filter: 'fake',
    })

    const sut = PaginationOutputMapper.toOutput(result.items, result)

    expect(sut).toEqual({
      items: ['fake'],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    })
  })
})
