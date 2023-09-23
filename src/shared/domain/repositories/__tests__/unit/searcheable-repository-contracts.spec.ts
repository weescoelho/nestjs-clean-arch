import { SearchParams } from '../../searcheable-repository-contracts'

describe('Searchable Repository unit tests', () => {
  describe('SearchParams tests', () => {
    it('should set page to 1 when page is not provided', () => {
      const sut = new SearchParams()
      expect(sut.page).toBe(1)

      const params = [
        { page: null as any, expect: 1 },
        { page: undefined as any, expect: 1 },
        { page: '' as any, expect: 1 },
        { page: 0 as any, expect: 1 },
        { page: -1 as any, expect: 1 },
        { page: {} as any, expect: 1 },
        { page: ' ' as any, expect: 1 },
        { page: 'abc' as any, expect: 1 },
        { page: '1.1' as any, expect: 1 },
        { page: '0' as any, expect: 1 },
        { page: '-1' as any, expect: 1 },
        { page: '-1.1' as any, expect: 1 },
        { page: 1 as any, expect: 1 },
        { page: 2 as any, expect: 2 },
        { page: true as any, expect: 1 },
        { page: false as any, expect: 1 },
        { page: '1' as any, expect: 1 },
        { page: '2' as any, expect: 2 },
      ]

      params.forEach(param => {
        expect(new SearchParams({ page: param.page }).page).toBe(param.expect)
      })
    })

    it('should set perPage to 15 when perPage is not provided or provided with invalid value', () => {
      const sut = new SearchParams()
      expect(sut.perPage).toBe(15)

      const params = [
        { perPage: null as any, expect: 15 },
        { perPage: undefined as any, expect: 15 },
        { perPage: '' as any, expect: 15 },
        { perPage: 0 as any, expect: 15 },
        { perPage: -1 as any, expect: 15 },
        { perPage: {} as any, expect: 15 },
        { perPage: ' ' as any, expect: 15 },
        { perPage: 'abc' as any, expect: 15 },
        { perPage: '1.1' as any, expect: 15 },
        { perPage: '0' as any, expect: 15 },
        { perPage: '-1' as any, expect: 15 },
        { perPage: '-1.1' as any, expect: 15 },
        { perPage: 1 as any, expect: 1 },
        { perPage: 2 as any, expect: 2 },
        { perPage: true as any, expect: 15 },
        { perPage: false as any, expect: 15 },
        { perPage: '1' as any, expect: 1 },
        { perPage: '2' as any, expect: 2 },
      ]

      params.forEach(param => {
        expect(new SearchParams({ perPage: param.perPage }).perPage).toBe(
          param.expect,
        )
      })
    })

    it('should set sort to null when sort is not provided or provided with invalid value', () => {
      const sut = new SearchParams()
      expect(sut.sort).toBe(null)

      const params = [
        { sort: null as any, expect: null },
        { sort: undefined as any, expect: null },
        { sort: '' as any, expect: null },
        { sort: {} as any, expect: null },
        { sort: ' ' as any, expect: null },
        { sort: 'test', expect: 'test' },
        { sort: 'test:asc', expect: 'test' },
        { sort: false, expect: null },
        { sort: true, expect: null },
      ]

      params.forEach(param => {
        expect(new SearchParams({ sort: param.sort }).sort).toBe(param.expect)
      })
    })

    it('should set sortDir to asc when sortDir is not provided or provided with invalid value', () => {
      let sut = new SearchParams()
      expect(sut.sortDir).toBe(null)

      sut = new SearchParams({ sort: null })
      expect(sut.sortDir).toBe(null)

      sut = new SearchParams({ sort: undefined })
      expect(sut.sortDir).toBe(null)

      sut = new SearchParams({ sort: '' })
      expect(sut.sortDir).toBe(null)

      const params = [
        { sortDir: null as any, expected: 'desc' },
        { sortDir: undefined as any, expected: 'desc' },
        { sortDir: '' as any, expected: 'desc' },
        { sortDir: 'test', expected: 'desc' },
        { sortDir: 0, expected: 'desc' },
        { sortDir: 'asc' as any, expected: 'asc' },
        { sortDir: 'desc', expected: 'desc' },
        { sortDir: 'ASC', expected: 'asc' },
        { sortDir: 'DESC', expected: 'desc' },
      ]
      params.forEach(param => {
        expect(
          new SearchParams({ sort: 'field', sortDir: param.sortDir }).sortDir,
        ).toBe(param.expected)
      })
    })

    it('filter prop', () => {
      const sut = new SearchParams()
      expect(sut.filter).toBe(null)

      const params = [
        { filter: null as any, expect: null },
        { filter: undefined as any, expect: null },
        { filter: '' as any, expect: null },
        { filter: {} as any, expect: '[object Object]' },
        { filter: ' ' as any, expect: null },
        { filter: 'test', expect: 'test' },
        { filter: false, expect: null },
        { filter: true, expect: null },
      ]

      params.forEach(param => {
        expect(new SearchParams({ filter: param.filter }).filter).toBe(
          param.expect,
        )
      })
    })
  })
})
