import { UserRepository } from '@/users/domain/repositories/user.repository'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'
import { UseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials'

export type SignInInput = {
  email: string
  password: string
}

export type SignInOutput = UserOutput

export class SignInUseCase implements UseCase<SignInInput, SignInOutput> {
  constructor(
    private userRepository: UserRepository.Repository,
    private hashProvider: HashProvider,
  ) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    const { email, password } = input

    if (!email || !password) {
      throw new BadRequestError('Input data not provided')
    }

    const entity = await this.userRepository.findByEmail(email)

    const hashPasswordMatches = await this.hashProvider.compareHash(
      password,
      entity.password,
    )

    if (!hashPasswordMatches) {
      throw new InvalidCredentialsError('Input data not provided')
    }

    return UserOutputMapper.toOutput(entity)
  }
}
