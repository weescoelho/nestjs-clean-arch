import { SignUpOutput } from '@/users/application/usecases/signup.usecase'
import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dtos/user-output'
import { SignUpDto } from '../../dtos/signup.dto'
import { SignInOutput } from '@/users/application/usecases/signin.usecase'
import { SignInDto } from '../../dtos/signin.dto'
import { UpdateUserOutput } from '@/users/application/usecases/update-user.usecase'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { UpdatePasswordOutput } from '@/users/application/usecases/update-password.usecase'
import { UpdatePasswordDto } from '../../dtos/update-password.dto'
import { GetUserOutput } from '@/users/application/usecases/getuser.usecase'
import { ListUsersOutput } from '@/users/application/usecases/listusers.usecase'
import { ListUsersDto } from '../../dtos/list-users.dto'
import {
  UserCollectionPresenter,
  UserPresenter,
} from '../../presenters/user.presenter'

describe('UsersController unit tests', () => {
  let sut: UsersController
  let id: string
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = 'b90d8682-b82f-44e6-8781-6b6ceb2126f0'
    props = {
      id,
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
      createdAt: new Date(),
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create a user', async () => {
    const output: SignUpOutput = props
    const mockSignUpUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['signUpUseCase'] = mockSignUpUseCase as any

    const input: SignUpDto = {
      name: 'John Doe',
      email: 'test@test.com',
      password: '123456',
    }

    const presenter = await sut.create(input)
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should authenticate a user', async () => {
    const output: SignInOutput = props
    const mockSignInUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    const mockAuthService = {
      generateJwt: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['signInUseCase'] = mockSignInUseCase as any
    sut['authService'] = mockAuthService as any

    const input: SignInDto = {
      email: 'test@test.com',
      password: '123456',
    }

    const result = await sut.login(input)
    expect(result).toEqual(output)
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should update a user', async () => {
    const output: UpdateUserOutput = props
    const mockUpdateUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['updateUserUseCase'] = mockUpdateUseCase as any

    const input: UpdateUserDto = {
      name: 'other_name',
    }

    const presenter = await sut.update(id, input)
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input })
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
  })

  it('should update password a user', async () => {
    const output: UpdatePasswordOutput = props
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any

    const input: UpdatePasswordDto = {
      oldPassword: '123456',
      password: '1234567',
    }

    const presenter = await sut.updatePassword(id, input)
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    })
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
  })

  it('should delete a user', async () => {
    const output = undefined
    const mockDeleteUser = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['deleteUserUseCase'] = mockDeleteUser as any

    const result = await sut.remove(id)
    expect(mockDeleteUser.execute).toHaveBeenCalledWith({ id })
    expect(output).toStrictEqual(result)
  })

  it('should gets a user', async () => {
    const output: GetUserOutput = props
    const mockGetUserUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['getUserUseCase'] = mockGetUserUseCase as any

    const presenter = await sut.findOne(id)
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id })
    expect(presenter).toBeInstanceOf(UserPresenter)
    expect(presenter).toStrictEqual(new UserPresenter(output))
  })

  it('should update list users', async () => {
    const output: ListUsersOutput = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    }
    const mockListUsersUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    }

    sut['listUsersUseCase'] = mockListUsersUseCase as any

    const input: ListUsersDto = {
      page: 1,
      perPage: 1,
    }

    const presenter = await sut.search(input)
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(input)
    expect(presenter).toBeInstanceOf(UserCollectionPresenter)
    expect(presenter).toEqual(new UserCollectionPresenter(output))
  })
})
