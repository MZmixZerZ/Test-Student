import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../member/infrastructure/persistence/member.schema';
import { Person } from '../person/infrastructure/persistence/person.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    @InjectModel(Person.name) private personModel: Model<Person>,
  ) {}

  async getSummary() {
    try {
      // Get total count of members
      const memberCount = await this.memberModel.countDocuments();

      // Get total count of persons
      const personCount = await this.personModel.countDocuments();

      // Get unique organization count from members
      const uniqueOrgsResult = await this.memberModel.aggregate([
        {
          $match: {
            organization: { $exists: true, $ne: null },
            $expr: { $ne: ['$organization', ''] }
          }
        },
        {
          $group: {
            _id: '$organization'
          }
        },
        {
          $count: 'total'
        }
      ]);

      const orgCount = uniqueOrgsResult.length > 0 ? uniqueOrgsResult[0].total : 0;

      return {
        member: memberCount,
        org: orgCount,
        person: personCount
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      return {
        member: 0,
        org: 0,
        person: 0
      };
    }
  }
}
