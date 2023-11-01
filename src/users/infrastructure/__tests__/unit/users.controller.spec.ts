import { SignUpOutput } from '@/users/application/usecases/signup.usecase'
import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dtos/user-output'
import { SignUpDto } from '../../dtos/signup.dto'

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

    const result = await sut.create(input)
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input)
    expect(output).toMatchObject(result)
  })
})
