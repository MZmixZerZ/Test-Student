import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMemberCommand } from './update-member.command';
import { MemberRepositoryInterface } from '../../domain/repositories/member.repository.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';
import { MemberEntity } from 'src/member/domain/entities/member.entity';

@CommandHandler(UpdateMemberCommand)
export class UpdateMemberHandler
  implements ICommandHandler<UpdateMemberCommand>
{
  constructor(
    @Inject('MemberRepository')
    private readonly memberRepository: MemberRepositoryInterface,
  ) {}

  async execute(command: UpdateMemberCommand): Promise<ResponseDto<MemberEntity>> {
    const { id, updateMemberDto, updatedBy  } = command;

    // หา Member จาก ID
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    Object.assign(member, updateMemberDto);
    member.updatedAt = new Date();
    member.updatedBy = updatedBy.id;
    member.companyId = updatedBy.companySelected;
    // อัปเดตข้อมูลในฐานข้อมูล
    const updMember = await this.memberRepository.update(member);
    return new ResponseDto<MemberEntity>(updMember);
  }
}
