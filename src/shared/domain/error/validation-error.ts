import { FieldsError } from '../validators/validator-fields.interface'

export class ValidatorError extends Error {}

export class EntityValidationError extends Error {
  constructor(public error: FieldsError) {
    super('Entity Validation Error')
    this.name = 'EntityValidationError'
  }
}
