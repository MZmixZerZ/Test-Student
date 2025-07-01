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
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const member = await this.memberModel.findById(id).exec();
    return member ? this.mapToEntity(member) : null;
  }

  async findByName(name: string): Promise<MemberEntity | null> {
    const member = await this.memberModel.findOne({ contactPerson: name }).exec();
    return member ? this.mapToEntity(member) : null;
  }

  async findByContactPersonName(name: string, surname: string): Promise<MemberEntity[]> {
    // ค้นหาจากชื่อผู้ติดต่อ รองรับทั้งการค้นหาแยกและรวมกัน
    const searchQueries = [];
    
    // ค้นหาจากชื่อเต็ม (ชื่อ + นามสกุล)
    const fullName = `${name} ${surname}`;
    searchQueries.push({ contactPerson: { $regex: CommonUtil.escapeRegExp(fullName), $options: 'i' } });
    
    // ค้นหาจากชื่อเดี่ยว
    searchQueries.push({ contactPerson: { $regex: CommonUtil.escapeRegExp(name), $options: 'i' } });
    
    // ค้นหาจากนามสกุลเดี่ยว (ถ้ามี)
    if (surname) {
      searchQueries.push({ contactPerson: { $regex: CommonUtil.escapeRegExp(surname), $options: 'i' } });
    }

    const members = await this.memberModel
      .find({ $or: searchQueries })
      .exec();
    
    return members.map((m) => this.mapToEntity(m));
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
    };

    const filter: any = {};
    // if (companyId) {
    //   filter.organization = companyId;
    // }

    if (keyword) {
      filter.$or = [
        { memberid: { $regex: CommonUtil.escapeRegExp(keyword), $options: 'i' } },
        { idCard: { $regex: CommonUtil.escapeRegExp(keyword), $options: 'i' } },
        { organization: { $regex: CommonUtil.escapeRegExp(keyword), $options: 'i' } },
        { contactPerson: { $regex: CommonUtil.escapeRegExp(keyword), $options: 'i' } },
        { contactPhone: { $regex: CommonUtil.escapeRegExp(keyword), $options: 'i' } },
      ];
    }

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

  async findAll(): Promise<MemberEntity[]> {
    const members = await this.memberModel.find().exec();
    return members.map((m) => this.mapToEntity(m));
  }

  async update(member: MemberEntity): Promise<MemberEntity> {
    const updatedMember = await this.memberModel.findByIdAndUpdate(
      member.id,
      member,
      { new: true }
    ).exec();
    return updatedMember ? this.mapToEntity(updatedMember) : null;
  }

  async delete(id: string): Promise<void> {
    await this.memberModel.findByIdAndDelete(id).exec();
  }

  private mapToEntity(member: any): MemberEntity {
    const plainObject = member.toObject();
    const entity = plainToInstance(MemberEntity, plainObject, {
      excludeExtraneousValues: true,
    });
    return entity;
  }
}
