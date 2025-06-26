import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { BadRequestException, HttpException, Inject } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/auth/domain/repositories/user.repository.interface';
import { AuthService } from 'src/auth/domain/services/auth.service';
import { UserEntity } from 'src/auth/domain/entities/user.entity';
import { CompanyRepositoryInterface } from 'src/auth/domain/repositories/company.repository.interface';
import { CompanyEntity } from 'src/auth/domain/entities/company.entity';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepositoryInterface,
    private readonly authService: AuthService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<string> {
    try {
      const { registerUserDto } = command;
      const today = new Date();
      const company = new CompanyEntity();
      company.name = registerUserDto.companyName;
      company.registerNo = registerUserDto.companyRegisterNo;

      const savedCompany = await this.companyRepository.save(company);
      const companyId = savedCompany.id;

      const user = new UserEntity();
      Object.assign(user, registerUserDto);
      user.role = 'owner';
      user.isActive = true;
      user.companies = [companyId];
      user.companySelected = companyId;

      user.password = await this.authService.hashPassword(
        registerUserDto.password,
      );
      user.createdAt = today;

      await this.userRepository.save(user);

      return this.authService.generateJwtToken(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
