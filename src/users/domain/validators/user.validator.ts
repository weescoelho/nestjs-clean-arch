import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEmail,
} from 'class-validator'
import { UserProps } from '../entities/user.entity'
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'

/**
 * @class UserRules
 * @description Classe de regras de validação para usuário.
 *
 * Criação das regras de validação para usuário.
 *
 */

export class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @MaxLength(255)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string

  @IsDate()
  @IsOptional()
  createdAt?: Date

  constructor({ email, name, password, createdAt }: UserProps) {
    Object.assign(this, { email, name, password, createdAt })
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserProps): boolean {
    return super.validate(new UserRules(data ?? ({} as UserProps)))
  }
}

// O Factory Method é responsável por criar uma instância da classe UserValidator.
// Sendo assim não é necessário instanciar a classe diretamente, sempre quando for usar a classe UserValidator
export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}
