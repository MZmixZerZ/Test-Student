import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/auth/domain/repositories/user.repository.interface';
import { CreateUserCommand } from './create-user.command';
import { UserEntity } from 'src/auth/domain/entities/user.entity';
import { AuthService } from 'src/auth/domain/services/auth.service';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryInterface,
    private readonly authService: AuthService,
  ) {}

  async execute(command: CreateUserCommand): Promise<ResponseDto<UserEntity>> {
    const { createUserDto, createBy } = command;

    const findUser = await this.userRepository.findByUsername(
      createUserDto.username,
    );
    if (findUser) {
      throw new BadRequestException('This username already exists');
    }

    const today = new Date();
    const user = new UserEntity();
    Object.assign(user, createUserDto);

    user.password = await this.authService.hashPassword(createUserDto.password);
    if (!user.companies) {
      user.companies = [createBy.companySelected];
    } else {
      user.companies.push(createBy.companySelected);
    }

    user.companySelected = createBy.companySelected;
    user.createdBy = createBy.username;
    user.createdAt = today;
    const newUser = await this.userRepository.save(user);
    return new ResponseDto<UserEntity>(newUser);
  }
}
