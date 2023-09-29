import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput } from '../dtos/user-output'
import { UseCase } from '@/shared/application/usecases/use-case'

type GetUserInput = {
  id: string
}

export type GetUserOutput = UserOutput

export class GetUserUseCase implements UseCase<GetUserInput, GetUserOutput> {
  constructor(private userRepository: UserRepository.Repository) {}

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const entity = await this.userRepository.findById(input.id)
    return entity.toJSON()
  }
}
