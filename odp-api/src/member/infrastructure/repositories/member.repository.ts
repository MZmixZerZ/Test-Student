import { MemberRepositoryInterface } from '../../domain/repositories/member.repository.interface';
import { MemberEntity } from '../../domain/entities/member.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Member } from '../persistence/member.schema';
import { plainToInstance } from 'class-transformer';
import { CommonUtil } from 'src/common/presentation/utils/common.util';

export class MemberRepository implements MemberRepositoryInterface {
  constructor(
    @InjectModel('Member')
    private readonly memberModel: Model<Member>,
  ) {}

  async save(member: MemberEntity): Promise<MemberEntity> {
    const createdMember = new this.memberModel(member);

    const savedMember = await createdMember.save();
    return this.mapToEntity(savedMember);
  }

  async findById(id: string): Promise<MemberEntity | null> {
    // แปลง id ที่รับเข้ามาให้เป็น ObjectId ก่อนใช้ในการค้นหา
    if (!Types.ObjectId.isValid(id)) {
      return null; // หรือสามารถโยนข้อผิดพลาดกลับไปได้เช่นกัน
    }
    const objectId = new Types.ObjectId(id);
    const member = await this.memberModel.findById(objectId).exec();
    return member ? this.mapToEntity(member) : null;
  }

  async findByName(name: string): Promise<MemberEntity | null> {
    const member = await this.memberModel.findOne({ name }).exec();
    return member ? this.mapToEntity(member) : null;
  }

  async findAllPaginated(
    page: number,
    limit: number,
    sortBy: string,
    sortType: string,
    keyword: string,
    companyId: string,
  ): Promise<{ data: MemberEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const sortOption: { [key: string]: 1 | -1 } = {
      [sortBy]: sortType === 'asc' ? 1 : -1,
    }; // การจัดเรียงตามฟิลด์ที่ระบุ

    const filter: any = { companyId: companyId};

    // Add keyword filter if provided
    if (keyword) {
      filter.$or = [
        {
          name: {
            $regex: CommonUtil.escapeRegExp(keyword),
            $options: 'i',
          },
        },
      ];
    }

    // Fetch total count
    const totalCount = await this.memberModel.countDocuments(filter);

    const members = await this.memberModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();
    
    return {
      data: members.map((t) => this.mapToEntity(t)),
      totalCount,
    };
  }

  async count(): Promise<number> {
    return this.memberModel.countDocuments().exec();
  }

  async update(member: MemberEntity): Promise<MemberEntity> {
    const updatedMember = await this.memberModel.findByIdAndUpdate(member.id, member);

    return this.mapToEntity(updatedMember);
  }

  async delete(id: string): Promise<void> {
    await this.memberModel.findByIdAndDelete(id);
  }

  private mapToEntity(member: any): MemberEntity {
    const plainObject = member.toObject();
    const entity = plainToInstance(MemberEntity, plainObject, {
      excludeExtraneousValues: true,
    });

    return entity;
  }
}
