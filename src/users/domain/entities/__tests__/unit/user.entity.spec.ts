import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UserEntity unit tests', () => {
  let props: UserProps
  let sut: UserEntity

  beforeEach(() => {
    UserEntity.validate = jest.fn()
    props = UserDataBuilder({})
    sut = new UserEntity(props)
  })

  it('should create a new user when props is provided in constructor', () => {
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.name).toEqual(props.name)
    expect(sut.email).toEqual(props.email)
    expect(sut.password).toEqual(props.password)
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  it('should return the name using getter', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.name).toBe('string')
  })

  it('should update name using setter ', () => {
    sut['name'] = 'other name'

    expect(sut.name).toEqual('other name')
    expect(typeof sut.name).toBe('string')
  })

  it('should update password using setter ', () => {
    sut['password'] = 'other password'

    expect(sut.password).toEqual('other password')
    expect(typeof sut.password).toBe('string')
  })

  it('should return the email using getter', () => {
    expect(sut.email).toBeDefined()
    expect(sut.email).toEqual(props.email)
    expect(typeof sut.email).toBe('string')
  })

  it('should return the password using getter', () => {
    expect(sut.password).toBeDefined()
    expect(sut.password).toEqual(props.password)
    expect(typeof sut.password).toBe('string')
  })

  it('should return the createdAt using getter', () => {
    expect(sut.createdAt).toBeDefined()
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  it('should update name using update method', () => {
    sut.update('other name')
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.name).toEqual('other name')
  })

  it('should update password using updatePassword method', () => {
    sut.updatePassword('other password')
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.password).toEqual('other password')
  })
})
