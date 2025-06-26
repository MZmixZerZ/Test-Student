import { RequestUserDto } from 'src/common/presentation/dtos/request-user.dto';
import { CreateMemberDto } from '../dtos/create-member.dto';

export class CreateMemberCommand {
  constructor(
    public readonly createMemberDto: CreateMemberDto,
    public readonly createdBy: RequestUserDto,
  ) {}
}
