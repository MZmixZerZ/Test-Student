import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Reflector } from '@nestjs/core';
import { RolesAndScopesGuard } from 'src/common/presentation/guards/roles-and-scopes.guard';
import { MemberController } from './presentation/controllers/member.controller';
import { CreateMemberHandler } from './application/commands/create-member.handler';
import { UpdateMemberHandler } from './application/commands/update-member.handler';
import { DeleteMemberHandler } from './application/commands/delete-member.handler';
import { GetAllMembersHandler } from './application/queries/get-all-members.handler';
import { GetMemberByIdHandler } from './application/queries/get-member-by-id.handler';
import { MemberRepository } from './infrastructure/repositories/member.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from './infrastructure/persistence/member.schema';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }])
  ],
  controllers: [MemberController],
  providers: [
    Reflector,
    RolesAndScopesGuard,
    CreateMemberHandler,
    UpdateMemberHandler,
    DeleteMemberHandler,
    GetAllMembersHandler,
    GetMemberByIdHandler,
    {
      provide: 'MemberRepository',
      useClass: MemberRepository,
    },
  ],
})
export class MemberModule {}
