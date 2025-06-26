import { RequestUserDto } from 'src/common/presentation/dtos/request-user.dto';
import { Role } from '../enums/role.enum';

export class GetAllUsersQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly sortBy: string = '',
    public readonly sortType: string = '',
    public readonly keyword: string = null,
    public readonly isActive: boolean = null,
    public readonly roles: string = null,
    public readonly requestUser: RequestUserDto,
  ) {}
}
