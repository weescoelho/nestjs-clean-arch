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
  })
})
