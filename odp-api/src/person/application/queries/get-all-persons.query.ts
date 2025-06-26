import { RequestUserDto } from 'src/common/presentation/dtos/request-user.dto';

export class GetAllPersonsQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly sortBy: string,
    public readonly sortType: string,
    public readonly keyword?: string,
    public readonly name?: string,
    public readonly surname?: string,
    public readonly user?: any,
  ) {}
}
