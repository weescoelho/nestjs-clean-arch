import { validate as uuidValidate } from 'uuid'
import { Entity } from '../entity'

/**
 * StubEntity é uma classe que herda de Entity, para ser usada nos testes.
 * Em testes de classes abstratas, é necessário criar uma classe que herde da classe abstrata.
 */

type StubProps = {
  prop1: string
  prop2: number
}
class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('should set props and id', () => {
    const props = {
      prop1: 'any_prop1',
      prop2: 1,
    }

    const sut = new StubEntity(props)

    expect(sut.props).toStrictEqual(props)
    expect(sut.id).not.toBeNull()
    expect(uuidValidate(sut.id)).toBeTruthy()
  })

  it('should accept a valid uuid', () => {
    const props = {
      prop1: 'any_prop1',
      prop2: 1,
    }

    const id = '36059b40-5525-4f68-a5ab-1b813b0e0747'

    const sut = new StubEntity(props, id)

    expect(uuidValidate(sut.id)).toBeTruthy()
    expect(sut.id).toEqual(id)
  })

  it('should return a json with id and props', () => {
    const props = {
      prop1: 'any_prop1',
      prop2: 1,
    }

    const sut = new StubEntity(props)

    expect(sut.toJSON()).toStrictEqual({
      id: sut.id,
      ...props,
    })
  })
})
