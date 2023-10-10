import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserOutputMapper } from '../../user-output'

describe('UserOutputMapper unit tests', () => {
  it('should convert a user in output', () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const spyToOutput = jest.spyOn(entity, 'toJSON')

    const sut = UserOutputMapper.toOutput(entity)

    expect(spyToOutput).toHaveBeenCalled()
    expect(sut).toEqual(entity.toJSON())
  })
})
