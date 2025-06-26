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
    const existingMember = await this.memberRepository.findByName(
      createMemberDto.name,
    );
    if (existingMember) {
      throw new BadRequestException('Member already exists');
    }
    const today = new Date();
    const member = new MemberEntity();
    Object.assign(member, createMemberDto);
    member.companyId = createdBy.companySelected;
    member.createdBy = createdBy.id;
    member.createdAt = today;
    const newMember = await this.memberRepository.save(member);
    return new ResponseDto<MemberEntity>(newMember);
  }
}
