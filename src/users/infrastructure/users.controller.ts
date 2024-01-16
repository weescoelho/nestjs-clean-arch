import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common'
import { SignUpDto } from './dtos/signup.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { SignUpUseCase } from '../application/usecases/signup.usecase'
import { SignInUseCase } from '../application/usecases/signin.usecase'
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase'
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase'
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase'
import { GetUserUseCase } from '../application/usecases/getuser.usecase'
import {
  ListUsersOutput,
  ListUsersUseCase,
} from '../application/usecases/listusers.usecase'
import { SignInDto } from './dtos/signin.dto'
import { ListUsersDto } from './dtos/list-users.dto'
import { UpdatePasswordDto } from './dtos/update-password.dto'
import { UserOutput } from '../application/dtos/user-output'
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presenters/user.presenter'
import { AuthService } from '@/auth/infrastructure/auth.service'

@Controller('users')
export class UsersController {
  @Inject(SignUpUseCase)
  private signUpUseCase: SignUpUseCase

  @Inject(SignInUseCase)
  private signInUseCase: SignInUseCase

  @Inject(UpdateUserUseCase)
  private updateUserUseCase: UpdateUserUseCase

  @Inject(UpdatePasswordUseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase

  @Inject(DeleteUserUseCase)
  private deleteUserUseCase: DeleteUserUseCase

  @Inject(GetUserUseCase)
  private getUserUseCase: GetUserUseCase

  @Inject(ListUsersUseCase)
  private listUsersUseCase: ListUsersUseCase

  @Inject(AuthService)
  private authService: AuthService

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output)
  }

  static listUsersToResponse(output: ListUsersOutput) {
    return new UserCollectionPresenter(output)
  }

  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    const output = await this.signUpUseCase.execute(signUpDto)
    return UsersController.userToResponse(output)
  }

  @HttpCode(200) // Altera o status code da resposta padrão do nestjs
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    const output = await this.signInUseCase.execute(signInDto)
    return this.authService.generateJwt(output.id)
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams)
    return UsersController.listUsersToResponse(output)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({
      id,
    })

    return UsersController.userToResponse(output)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    })
    return UsersController.userToResponse(output)
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    })
    return UsersController.userToResponse(output)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({
      id,
    })
  }
}
