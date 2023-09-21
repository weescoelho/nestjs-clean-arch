import { ClassValidatorFields } from '../../class-validator-fields'
import * as libClassValidator from 'class-validator'

/**
 * StubClassValidatorFields cria um dublê de teste para a classe abstrata ClassValidatorFields.
 * A classe abstrata ClassValidatorFields é uma classe abstrata que implementa a interface ValidatorFieldsInterface.
 */

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string
}> {}

describe('ClassValidatorFields unit tests', () => {
  it('should initialize errors and validatedData variables with null', () => {
    const sut = new StubClassValidatorFields()

    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toBeNull()
  })

  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')

    spyValidateSync.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'test error' } },
    ])

    const sut = new StubClassValidatorFields()

    expect(sut.validate(null)).toBeFalsy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(sut.validatedData).toBeNull()
    expect(sut.errors).toStrictEqual({ field: ['test error'] })
  })

  it('should validate without errors', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')

    spyValidateSync.mockReturnValue([])

    const sut = new StubClassValidatorFields()
    const data = { field: 'teste' }

    expect(sut.validate(data)).toBeTruthy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(sut.validatedData).toStrictEqual(data)
    expect(sut.errors).toBeNull()
  })
})
