import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/auth/domain/repositories/user.repository.interface';
import { AuthService } from 'src/auth/domain/services/auth.service';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';
import { UserEntity } from 'src/auth/domain/entities/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryInterface,
    private readonly authService: AuthService,
  ) {}

  async execute(command: UpdateUserCommand): Promise<ResponseDto<UserEntity>> {
    const { id, updateUserDto, updatedBy } = command;
    const findUser = await this.userRepository.findByUsername(
      updateUserDto.username,
    );
    if (findUser && findUser.id !== id) {
      throw new BadRequestException('This username already exists');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const oldPass = user.password;
    Object.assign(user, updateUserDto);
    user.updatedAt = new Date();
    user.updatedBy = updatedBy;
    if (updateUserDto.password) {
      user.password = await this.authService.hashPassword(
        updateUserDto.password,
      );
    } else {
      user.password = oldPass;
    }

    const updUser = await this.userRepository.update(user);
    return new ResponseDto<UserEntity>(updUser);
  }
}
