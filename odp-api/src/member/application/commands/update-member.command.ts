import { RequestUserDto } from 'src/common/presentation/dtos/request-user.dto';
import { UpdateMemberDto } from '../dtos/update-member.dto';

export class UpdateMemberCommand {
  constructor(
    public readonly id: string,
    public readonly updateMemberDto: UpdateMemberDto,
    public readonly updatedBy: RequestUserDto,
  ) {}
}
