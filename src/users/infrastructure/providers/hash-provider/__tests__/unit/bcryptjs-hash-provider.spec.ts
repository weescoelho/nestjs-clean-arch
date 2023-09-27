import { BcryptjsHashProvider } from '../../bcryptjs-hash-provider'

describe('BcriptHashProvider unit test', () => {
  let sut: BcryptjsHashProvider

  beforeEach(() => {
    sut = new BcryptjsHashProvider()
  })

  it('should generate a hash', async () => {
    const hash = await sut.generateHash('any_value')
    expect(hash).toBeDefined()
  })

  it('should compare a hash', async () => {
    const hash = await sut.generateHash('any_value')
    const isValid = await sut.compareHash('any_value', hash)
    expect(isValid).toBeTruthy()
  })

  it('should return false when compare a invalid hash', async () => {
    const hash = await sut.generateHash('any_value')
    const isValid = await sut.compareHash('other_value', hash)
    expect(isValid).toBeFalsy()
  })
})
