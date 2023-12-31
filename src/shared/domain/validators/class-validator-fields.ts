import { validateSync } from 'class-validator'
import {
  FieldsError,
  ValidatorFieldsInterface,
} from './validator-fields.interface'

/**
 * @class ClassValidatorFields
 * @description Classe abstrata para validação de dados com class-validator.
 */

export abstract class ClassValidatorFields<T>
  implements ValidatorFieldsInterface<T>
{
  errors: FieldsError = null
  validatedData: T = null

  validate(data: any): boolean {
    const errors = validateSync(data)

    if (errors.length) {
      this.errors = {}

      for (const error of errors) {
        const { property, constraints } = error
        this.errors[property] = Object.values(constraints)
      }
    } else {
      this.validatedData = data
    }

    return !errors.length
  }
}
