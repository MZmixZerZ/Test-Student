import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserEntity } from 'src/auth/domain/entities/user.entity';

@Schema()
export class User extends UserEntity {}

export const UserSchema = SchemaFactory.createForClass(User);
