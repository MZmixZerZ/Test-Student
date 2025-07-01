import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMemberCommand } from './create-member.command';
import { MemberRepositoryInterface } from '../../domain/repositories/member.repository.interface';
import { BadRequestException } from '@nestjs/common';
import { MemberEntity } from '../../domain/entities/member.entity';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';

@CommandHandler(CreateMemberCommand)
export class CreateMemberHandler
  implements ICommandHandler<CreateMemberCommand>
{
  constructor(
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(command: CreateMemberCommand): Promise<ResponseDto<MemberEntity>> {
    const { createMemberDto, createdBy } = command;

    // ตรวจสอบซ้ำด้วย memberid (unique)
    const existingMember = await this.memberRepository.findByName(
      createMemberDto.memberid,
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
