import { RequestUserDto } from 'src/common/presentation/dtos/request-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';

export class CreateUserCommand {
  constructor(
    public readonly createUserDto: CreateUserDto,
    public readonly createBy: RequestUserDto,
  ) {}
}
