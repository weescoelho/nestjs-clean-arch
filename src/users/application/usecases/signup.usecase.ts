import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { UserOutput } from '../dtos/user-output'
import { UseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

export type SignUpInput = {
  name: string
  email: string
  password: string
}

export type SignUpOutput = UserOutput

export class SignUpUseCase implements UseCase<SignUpInput, SignUpOutput> {
  constructor(
    private userRepository: UserRepository.Repository,
    private hashProvider: HashProvider,
  ) {}

  async execute(input: SignUpInput): Promise<SignUpOutput> {
    const { name, email, password } = input

    if (!name || !email || !password) {
      throw new BadRequestError('Input data not provided')
    }

    await this.userRepository.emailExists(email)
    const hashPassword = await this.hashProvider.generateHash(password)

    const entity = new UserEntity(
      Object.assign(input, { password: hashPassword }),
    )
    await this.userRepository.insert(entity)

    return entity.toJSON()
  }
}
