import { UpdatePasswordInput } from '@/users/application/usecases/update-password.usecase'

export class UpdatePasswordDto implements Omit<UpdatePasswordInput, 'id'> {
  password: string
  oldPassword: string
}
