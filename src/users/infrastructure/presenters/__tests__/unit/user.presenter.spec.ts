import { instanceToPlain } from 'class-transformer'
import { UserPresenter } from '../../user.presenter'

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
