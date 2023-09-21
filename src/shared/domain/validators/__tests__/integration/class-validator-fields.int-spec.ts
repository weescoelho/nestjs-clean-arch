import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

/**
 * StubClassValidatorFields cria um dublê de teste para a classe abstrata ClassValidatorFields.
 * StubRules é uma classe que dita as regras de validação para o stub.
 *
 * O teste de integração é feito para garantir que a classe ClassValidatorFields está funcionando corretamente,
 * juntamente com a biblioteca class-validator.
 */

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsNumber()
  price: number

  constructor(data: any) {
    Object.assign(this, data)
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data))
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('should validate with errors', () => {
    const sut = new StubClassValidatorFields()

    const isValid = sut.validate(null)

    expect(isValid).toBeFalsy()
    expect(sut.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price must be a number conforming to the specified constraints',
        'price should not be empty',
      ],
    })
  })

  it('should validate without errors', () => {
    const sut = new StubClassValidatorFields()
    const validData = {
      name: 'any_name',
      price: 10,
    }

    const isValid = sut.validate(validData)

    expect(isValid).toBeTruthy()
    expect(sut.validatedData).toStrictEqual(new StubRules(validData))
  })
})
