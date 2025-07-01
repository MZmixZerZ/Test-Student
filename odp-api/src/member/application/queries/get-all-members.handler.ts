import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllMembersQuery } from './get-all-members.query';
import { MemberRepositoryInterface } from '../../domain/repositories/member.repository.interface';
import { MemberEntity } from '../../domain/entities/member.entity';
import { PaginatedResponseDto } from 'src/common/presentation/dtos/paginated-response.dto';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';

@QueryHandler(GetAllMembersQuery)
export class GetAllMembersHandler
  implements IQueryHandler<GetAllMembersQuery>
{
  constructor(
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(
    query: GetAllMembersQuery,
  ): Promise<PaginatedResponseDto<MemberEntity>> {
    const { page, limit, sortBy, sortType, keyword, queryBy } = query;

    // คำนวณและดึงรายการผู้สมัครงานตาม page และ limit
    const members = await this.memberRepository.findAllPaginated(
      page,
      limit,
      sortBy,
      sortType,
      keyword,
      queryBy.companySelected,
    );

    // ดึงจำนวนรายการทั้งหมด
    const totalItems = members.totalCount;

    // ส่งข้อมูลแบบแบ่งหน้า
    return new PaginatedResponseDto(members.data, totalItems, limit, page);
  }
}
