import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../persistence/user.schema';
import { UserRepositoryInterface } from 'src/auth/domain/repositories/user.repository.interface';
import { UserEntity } from 'src/auth/domain/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { CommonUtil } from 'src/common/presentation/utils/common.util';

export class UserRepository implements UserRepositoryInterface {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();
    return this.mapToEntity(savedUser);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    // ต้อง select password ด้วย เพื่อใช้ตรวจสอบรหัสผ่าน
    const user = await this.userModel.findOne({ username: username }).select('+password');
    return user ? this.mapToEntity(user, true) : null;
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments();
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const updatUser = await this.userModel.findByIdAndUpdate(user.id, user);
    return this.mapToEntity(updatUser);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userModel.find().exec();
    return users.map((t) => this.mapToEntity(t));
  }

  async findById(id: string): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const objectId = new Types.ObjectId(id);
    const user = await this.userModel.findById(objectId);
    return user ? this.mapToEntity(user) : null;
  }

  async findAllCountPaginated(
    page: number,
    limit: number,
    sortBy: string,
    sortType: string,
    keyword: string,
    isActive: boolean,
    roles: string,
    company: string,
  ): Promise<[UserEntity[], number]> {
    const filter: any = {};
    if (keyword) {
      filter.$or = [
        {
          username: { $regex: CommonUtil.escapeRegExp(keyword), $options: 'i' },
        },
      ];
    }

    if (isActive !== null) {
      filter.isActive = isActive;
    }

    if (company !== null) {
      filter.$and = [{ companies: { $in: [company] } }];
    }

    if (roles) {
      filter.role = roles;
    }

    const skip = (page - 1) * limit;
    const sortOption: { [key: string]: 1 | -1 } = {
      [sortBy]: sortType === 'asc' ? 1 : -1,
    };

    const queryUser = this.userModel
      .find(filter)
      .select('-password')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();

    const [users, count] = await Promise.all([
      queryUser,
      this.userModel.countDocuments(filter),
    ]);

    return [users.map((t) => this.mapToEntity(t)), count];
  }

  // เพิ่ม argument keepPassword เพื่อเลือกว่าจะคืน password กลับไปหรือไม่
  private mapToEntity(user: any, keepPassword = false): UserEntity {
    const plainObject = user.toObject();
    if (!keepPassword) {
      delete plainObject.password;
    }
    const entity = plainToInstance(UserEntity, plainObject, {
      excludeExtraneousValues: true,
    });

    // กรณีต้องการใช้ password ในการตรวจสอบ
    if (keepPassword && user.password) {
      (entity as any).password = user.password;
    }

    return entity;
  }
}
