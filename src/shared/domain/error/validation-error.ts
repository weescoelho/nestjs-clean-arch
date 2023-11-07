import { FieldsError } from '../validators/validator-fields.interface'

/**
 * @class ValidatorError
 * @extends {Error}
 * @description Classe de erro para validação de dados.
 */

export class ValidationError extends Error {}

export class EntityValidationError extends Error {
  constructor(public error: FieldsError) {
    super('Entity Validation Error')
    this.name = 'EntityValidationError'
  }
}
