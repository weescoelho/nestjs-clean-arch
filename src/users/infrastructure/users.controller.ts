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
import { ListUsersUseCase } from '../application/usecases/listusers.usecase'
import { SignInDto } from './dtos/signin.dto'
import { ListUsersDto } from './dtos/list-users.dto'
import { UpdatePasswordDto } from './dtos/update-password.dto'

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

  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    return this.signUpUseCase.execute(signUpDto)
  }

  @HttpCode(200) // Altera o status code da resposta padrão do nestjs
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    return this.signInUseCase.execute(signInDto)
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return this.listUsersUseCase.execute(searchParams)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute({
      id,
    })
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    })
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    })
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({
      id,
    })
  }
}
