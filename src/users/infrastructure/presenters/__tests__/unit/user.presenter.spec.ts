import { instanceToPlain } from 'class-transformer'
import { UserCollectionPresenter, UserPresenter } from '../../user.presenter'
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter'

describe('UserPresenter unit tests', () => {
  let sut: UserPresenter
  const createdAt = new Date()

  const props = {
    id: '976b0fae-2bc8-4050-a519-9a74730c3649',
    name: 'John Doe',
    email: 'email@email.com',
    password: 'fake',
    createdAt,
  }

  beforeEach(() => {
    sut = new UserPresenter(props)
  })

  describe('constructor', () => {
    it('should create a new UserPresenter instance', () => {
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.email).toEqual(props.email)
      expect(sut.createdAt).toEqual(props.createdAt)
    })
  })

  it('should presenter data', () => {
    const output = instanceToPlain(sut)
    expect(output).toEqual({
      id: '976b0fae-2bc8-4050-a519-9a74730c3649',
      name: 'John Doe',
      email: 'email@email.com',
      createdAt: props.createdAt.toISOString(),
    })
  })
})

describe('UserCollectionPresenter unit tests', () => {
  let sut: UserCollectionPresenter
  const createdAt = new Date()
  const props = {
    id: '976b0fae-2bc8-4050-a519-9a74730c3649',
    name: 'John Doe',
    email: 'email@email.com',
    password: 'fake',
    createdAt,
  }

  describe('constructor', () => {
    it('should set values', () => {
      const sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      })

      expect(sut.meta).toBeInstanceOf(PaginationPresenter)
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      )
      expect(sut.data).toStrictEqual([new UserPresenter(props)])
      expect(sut.meta.currentPage).toEqual(1)
    })
  })

  it('should presenter data', () => {
    let sut = new UserCollectionPresenter({
      items: [props],
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
      total: 1,
    })

    let output = instanceToPlain(sut)
    expect(output).toEqual({
      data: [
        {
          id: '976b0fae-2bc8-4050-a519-9a74730c3649',
          name: 'John Doe',
          email: 'email@email.com',
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      },
    })

    sut = new UserCollectionPresenter({
      items: [props],
      currentPage: '1' as any,
      perPage: '2' as any,
      lastPage: '1' as any,
      total: '1' as any,
    })

    output = instanceToPlain(sut)
    expect(output).toEqual({
      data: [
        {
          id: '976b0fae-2bc8-4050-a519-9a74730c3649',
          name: 'John Doe',
          email: 'email@email.com',
          createdAt: createdAt.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      },
    })
  })
})
