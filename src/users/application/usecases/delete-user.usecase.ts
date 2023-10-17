import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UseCase } from '@/shared/application/usecases/use-case'

type DeleteUserInput = {
  id: string
}

export type DeleteUserOutput = void

export class DeleteUserUseCase
  implements UseCase<DeleteUserInput, DeleteUserOutput>
{
  constructor(private userRepository: UserRepository.Repository) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    await this.userRepository.delete(input.id)
  }
}
