import { SignInInput } from '@/users/application/usecases/signin.usecase'

export class SignInDto implements SignInInput {
  email: string
  password: string
}
