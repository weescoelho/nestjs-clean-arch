import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output'
import { SearchInput } from '@/shared/application/dtos/search-input'
import { UseCase } from '@/shared/application/usecases/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dtos/user-output'

export type ListUsersInput = SearchInput

export type ListUsersOutput = PaginationOutput<UserOutput>

export class ListUsersUseCase
  implements UseCase<ListUsersInput, ListUsersOutput>
{
  constructor(private userRepository: UserRepository.Repository) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    const params = new UserRepository.SearchParams(input)
    const searchResult = await this.userRepository.search(params)
    return this.toOutput(searchResult)
  }

  private toOutput(searchResult: UserRepository.SearchResult): ListUsersOutput {
    const items = searchResult.items.map(entity =>
      UserOutputMapper.toOutput(entity),
    )
    return PaginationOutputMapper.toOutput(items, searchResult)
  }
}
