import { Entity } from '@/shared/domain/entities/entity'
import { UserValidatorFactory } from '../validators/user.validator'
import { EntityValidationError } from '@/shared/domain/error/validation-error'

export type UserProps = {
  name: string
  email: string
  password: string
  createdAt?: Date
}

/**
 * @class UserEntity
 * @extends {Entity<UserProps>}
 * @description Classe de entidade de usuário.
 *
 * A classe de entidade é responsável por representar um usuário.
 * Está extendendo a classe abstrata Entity, que é responsável por gerar um id único para a entidade.
 * O generics UserProps é responsável por tipar as props da entidade.
 *
 */

export class UserEntity extends Entity<UserProps> {
  constructor(public readonly props: UserProps) {
    UserEntity.validate(props)
    super(props)
    this.props.createdAt = this.props.createdAt ?? new Date()
  }

  //Regras do DDD = Qualquer alteração, validação ou regra de negócio deve ser feita dentro da entidade.
  update(value: string): void {
    UserEntity.validate({ ...this.props, name: value })
    this.name = value
  }

  updatePassword(value: string): void {
    UserEntity.validate({ ...this.props, password: value })
    this.password = value
  }

  get name(): string {
    return this.props.name
  }

  private set name(value: string) {
    this.props.name = value
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  private set password(value: string) {
    this.props.password = value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  static validate(props: UserProps) {
    const validator = UserValidatorFactory.create()
    const isValid = validator.validate(props)
    if (!isValid) {
      throw new EntityValidationError(validator.errors)
    }
  }
}
