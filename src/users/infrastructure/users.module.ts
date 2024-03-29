import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { SignUpUseCase } from '../application/usecases/signup.usecase'
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash-provider'
import { SignInUseCase } from '../application/usecases/signin.usecase'
import { GetUserUseCase } from '../application/usecases/getuser.usecase'
import { ListUsersUseCase } from '../application/usecases/listusers.usecase'
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase'
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase'
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserPrismaRepository } from './database/prisma/repositories/user-prisma.repository'
import { AuthModule } from '@/auth/infrastructure/auth.module'
import { AuthService } from '@/auth/infrastructure/auth.service'

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    // Factory Pattern - Injeção das dependencias do SignUpUseCase
    {
      provide: SignUpUseCase,
      useFactory: (
        userRepository: UserInMemoryRepository,
        hashProvider: BcryptjsHashProvider,
      ) => {
        return new SignUpUseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SignInUseCase,
      useFactory: (
        userRepository: UserInMemoryRepository,
        hashProvider: BcryptjsHashProvider,
      ) => {
        return new SignInUseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase,
      useFactory: (userRepository: UserInMemoryRepository) => {
        return new GetUserUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase,
      useFactory: (userRepository: UserInMemoryRepository) => {
        return new ListUsersUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepository: UserInMemoryRepository) => {
        return new UpdateUserUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUseCase,
      useFactory: (
        userRepository: UserInMemoryRepository,
        hashProvider: BcryptjsHashProvider,
      ) => {
        return new UpdatePasswordUseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: UserInMemoryRepository) => {
        return new DeleteUserUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
