import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllUsersQuery } from './get-all-users.query';
import { Inject } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/auth/domain/repositories/user.repository.interface';
import { UserEntity } from 'src/auth/domain/entities/user.entity';
import { PaginatedResponseDto } from 'src/common/presentation/dtos/paginated-response.dto';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(
    query: GetAllUsersQuery,
  ): Promise<PaginatedResponseDto<UserEntity>> {
    const {
      page,
      limit,
      sortBy,
      sortType,
      keyword,
      isActive,
      roles,
      requestUser,
    } = query;

    const [users, totalItems] = await this.userRepository.findAllCountPaginated(
      page,
      limit,
      sortBy,
      sortType,
      keyword,
      isActive,
      roles,
      requestUser.companySelected,
    );

    return new PaginatedResponseDto(users, totalItems, limit, page);
  }
}
