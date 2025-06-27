import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMemberCommand } from './create-member.command';
import { MemberRepositoryInterface } from '../../domain/repositories/member.repository.interface';
import { BadRequestException, Inject } from '@nestjs/common';
import { MemberEntity } from '../../domain/entities/member.entity';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';

@CommandHandler(CreateMemberCommand)
export class CreateMemberHandler
  implements ICommandHandler<CreateMemberCommand>
{
  constructor(
    @Inject('MemberRepository')
    private readonly memberRepository: MemberRepositoryInterface,
  ) {}

  async execute(command: CreateMemberCommand): Promise<ResponseDto<MemberEntity>> {
    const { createMemberDto, createdBy } = command;

    // ตรวจสอบซ้ำด้วย memberId (unique)
    const existingMember = await this.memberRepository.findByName(
      createMemberDto.memberId,
    );
    if (existingMember) {
      throw new BadRequestException('Member ID already exists');
    }

    const today = new Date();
    const member = new MemberEntity();
    Object.assign(member, createMemberDto);
    member.createdBy = createdBy.id;
    member.createdAt = today;

    const newMember = await this.memberRepository.save(member);
    return new ResponseDto<MemberEntity>(newMember);
  }
}
