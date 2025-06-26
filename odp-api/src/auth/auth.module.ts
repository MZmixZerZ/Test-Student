import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/auth.controller';
import { AdminController } from './presentation/controllers/admin.controller';
import { RegisterUserHandler } from './application/commands/register-user.handler';
import { SignInUserHandler } from './application/commands/signin-user.handler';
import { UpdateUserHandler } from './application/commands/update-user.handler';
import { ResetPasswordHandler } from './application/commands/reset-password.handler';
import { DeleteUserHandler } from './application/commands/delete-user.handler';
import { AuthService } from './domain/services/auth.service';
import { Reflector } from '@nestjs/core';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { GetAllUsersHandler } from './application/queries/get-all-users.handler';
import { RolesAndScopesGuard } from 'src/common/presentation/guards/roles-and-scopes.guard';
import { CreateUserHandler } from './application/commands/create-user.handler';
import { GetUserByIdHandler } from './application/queries/get-user-by-id.handler';
import { CompanyRepository } from './infrastructure/repositories/company.repository';
import { CompanyController } from './presentation/controllers/company.controller';
import { GetCompanyByIdHandler } from './application/queries/get-company-by-id.handler';
import { UpdateCompanyHandler } from './application/commands/update-company.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './infrastructure/persistence/user.schema';
import { CompanySchema } from './infrastructure/persistence/company.schema';
import * as dotenv from 'dotenv';

dotenv.config(); // โหลดตัวแปรจากไฟล์ .env ก่อน

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Company', schema: CompanySchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, AdminController, CompanyController],
  providers: [
    Reflector,
    RolesAndScopesGuard,
    GetUserByIdHandler,
    GetAllUsersHandler,
    RegisterUserHandler,
    SignInUserHandler,
    UpdateUserHandler,
    ResetPasswordHandler,
    DeleteUserHandler,
    CreateUserHandler,
    GetCompanyByIdHandler,
    UpdateCompanyHandler,
    AuthService,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'CompanyRepository',
      useClass: CompanyRepository,
    },
  ],
})
export class AuthModule {}
