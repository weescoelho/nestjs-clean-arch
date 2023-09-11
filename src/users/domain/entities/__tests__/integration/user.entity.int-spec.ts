import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'
import { EntityValidationError } from '@/shared/domain/error/validation-error'

describe('UserEntity integration tests', () => {
  describe('Constructor method', () => {
    it('should throw an error when creating a user with invalid name', () => {
      let props: UserProps = { ...UserDataBuilder({}), name: null }

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), name: '' }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 10 as any }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('should throw an error when creating a user with invalid email', () => {
      let props: UserProps = { ...UserDataBuilder({}), email: null }

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), email: '' }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 10 as any }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('should throw an error when creating a user with invalid password', () => {
      let props: UserProps = { ...UserDataBuilder({}), password: null }

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), password: '' }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 10 as any }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 'a'.repeat(101) }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('should throw an error when creating a user with invalid createdAt', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        createdAt: '2023' as any,
      }

      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)

      props = { ...UserDataBuilder({}), createdAt: 10 as any }
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError)
    })

    it('should create a valid user', () => {
      expect.assertions(0) // <- verifica se o teste não lançou nenhum erro
      const props: UserProps = UserDataBuilder({})

      new UserEntity(props)
    })
  })

  describe('update method', () => {
    it('should throw an error when update a user with invalid name', () => {
      const entity = new UserEntity(UserDataBuilder({}))

      expect(() => entity.update(null)).toThrowError(EntityValidationError)
      expect(() => entity.update('')).toThrowError(EntityValidationError)
      expect(() => entity.update(1 as any)).toThrowError(EntityValidationError)
      expect(() => entity.update('a'.repeat(256))).toThrowError(
        EntityValidationError,
      )
    })

    it('should update a valid user', () => {
      expect.assertions(0) // <- verifica se o teste não lançou nenhum erro
      const entity = new UserEntity(UserDataBuilder({}))

      entity.update('new name')
    })
  })

  describe('updatePassword method', () => {
    it('should throw an error when update a user with invalid password', () => {
      const entity = new UserEntity(UserDataBuilder({}))

      expect(() => entity.updatePassword(null)).toThrowError(
        EntityValidationError,
      )
      expect(() => entity.updatePassword('')).toThrowError(
        EntityValidationError,
      )
      expect(() => entity.updatePassword(1 as any)).toThrowError(
        EntityValidationError,
      )
      expect(() => entity.updatePassword('a'.repeat(101))).toThrowError(
        EntityValidationError,
      )
    })

    it('should update a valid user', () => {
      expect.assertions(0)
      const entity = new UserEntity(UserDataBuilder({}))

      entity.updatePassword('new password')
    })
  })
})
