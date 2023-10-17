import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase } from '@/shared/application/usecases/use-case'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'

type UpdatePasswordInput = {
  id: string
  password: string
  oldPassword: string
}

export type UpdatePasswordOutput = UserOutput

export class UpdatePasswordUseCase
  implements UseCase<UpdatePasswordInput, UpdatePasswordOutput>
{
  constructor(
    private userRepository: UserRepository.Repository,
    private hashProvider: HashProvider,
  ) {}

  async execute(input: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
    const entity = await this.userRepository.findById(input.id)

    if (!input.password || !input.oldPassword)
      throw new InvalidPasswordError(
        'Old password and new password not provided',
      )

    const checkOldpassword = await this.hashProvider.compareHash(
      input.oldPassword,
      entity.password,
    )

    if (!checkOldpassword)
      throw new InvalidPasswordError('Old password does not match')

    const hashPassword = await this.hashProvider.generateHash(input.password)

    entity.updatePassword(hashPassword)
    await this.userRepository.update(entity)
    return UserOutputMapper.toOutput(entity)
  }
}
