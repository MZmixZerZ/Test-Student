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
      // Get real-time counts with parallel execution
      const [memberCount, personCount, recentMembers, recentPersons, orgStats] = await Promise.all([
        this.memberModel.countDocuments(),
        this.personModel.countDocuments(),
        this.getRecentMembersCount(),
        this.getRecentPersonsCount(),
        this.getOrgStats()
      ]);

      // Calculate growth percentages (simulated for demo)
      const memberGrowth = Math.floor(Math.random() * 20) + 5; // 5-25%
      const personGrowth = Math.floor(Math.random() * 15) + 3; // 3-18%
      const orgGrowth = Math.floor(Math.random() * 10) + 2; // 2-12%

      return {
        member: memberCount,
        org: orgStats.total,
        person: personCount,
        stats: {
          totalMembers: memberCount,
          totalPersons: personCount,
          totalOrganizations: orgStats.total,
          recentMembers: recentMembers,
          recentPersons: recentPersons,
          growthRates: {
            members: memberGrowth,
            persons: personGrowth,
            organizations: orgGrowth
          },
          topOrganizations: orgStats.top,
          lastUpdated: new Date().toISOString()
        }
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

  private async getRecentMembersCount(): Promise<number> {
    // Get members created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return await this.memberModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
  }

  private async getRecentPersonsCount(): Promise<number> {
    // Get persons created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return await this.personModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
  }

  private async getOrgStats(): Promise<{ total: number; top: any[] }> {
    try {
      // Get unique organization count and top organizations
      const orgPipeline = [
        {
          $match: {
            organization: { $exists: true, $ne: null },
            $expr: { $ne: ['$organization', ''] }
          }
        },
        {
          $group: {
            _id: '$organization',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 as const }
        }
      ];

      const orgsWithCount = await this.memberModel.aggregate(orgPipeline);
      
      return {
        total: orgsWithCount.length,
        top: orgsWithCount.slice(0, 5).map(org => ({
          name: org._id,
          memberCount: org.count
        }))
      };
    } catch (error) {
      console.error('Error getting org stats:', error);
      return { total: 0, top: [] };
    }
  }
}
