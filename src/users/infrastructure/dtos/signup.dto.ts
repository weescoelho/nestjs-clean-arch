import { SignUpInput } from '@/users/application/usecases/signup.usecase'

export class SignUpDto implements SignUpInput {
  name: string
  email: string
  password: string
}
