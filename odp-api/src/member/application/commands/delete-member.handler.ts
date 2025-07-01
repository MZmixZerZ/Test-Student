import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteMemberCommand } from './delete-member.command';
import { MemberRepositoryInterface } from '../../domain/repositories/member.repository.interface';
import { NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';

@CommandHandler(DeleteMemberCommand)
export class DeleteMemberHandler
  implements ICommandHandler<DeleteMemberCommand>
{
  constructor(
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(command: DeleteMemberCommand): Promise<void> {
    const { id } = command;

    // ตรวจสอบว่าผู้สมัครที่ต้องการลบมีอยู่ในระบบหรือไม่
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    // ลบผู้สมัคร
    await this.memberRepository.delete(id);
  }
}
