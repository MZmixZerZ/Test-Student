import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';
import { GetMemberByIdQuery } from './get-member-by-id.query';
import { MemberRepositoryInterface } from '../../domain/repositories/member.repository.interface';
import { MemberEntity } from '../../domain/entities/member.entity';

@QueryHandler(GetMemberByIdQuery)
export class GetMemberByIdHandler
  implements IQueryHandler<GetMemberByIdQuery>
{
  constructor(
    @Inject('MemberRepository')
    private readonly memberRepository: MemberRepositoryInterface,
  ) {}

  async execute(query: GetMemberByIdQuery): Promise<ResponseDto<MemberEntity>> {
    const { id } = query;

    // ดึงข้อมูลผู้สมัครตาม ID
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return new ResponseDto<MemberEntity>(member);
  }
}
