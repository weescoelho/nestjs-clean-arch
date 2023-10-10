import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

type UpdateUserInput = {
  id: string
  name: string
}

export type UpdateUserOutput = UserOutput

export class UpdateUserUseCase
  implements UseCase<UpdateUserInput, UpdateUserOutput>
{
  constructor(private userRepository: UserRepository.Repository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    if (!input.name) throw new BadRequestError('Name not provided')

    const entity = await this.userRepository.findById(input.id)
    entity.update(input.name)

    await this.userRepository.update(entity)

    return UserOutputMapper.toOutput(entity)
  }
}
