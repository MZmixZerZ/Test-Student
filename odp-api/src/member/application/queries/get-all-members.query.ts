import { RequestUserDto } from 'src/common/presentation/dtos/request-user.dto';

export class GetAllMembersQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly sortBy: string = '',
    public readonly sortType: string = '',
    public readonly keyword: string = '',
    public readonly queryBy: RequestUserDto,
  ) {}
}
