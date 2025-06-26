import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/auth/domain/repositories/user.repository.interface';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { id } = command;

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with username ${id} not found`);
    }

    await this.userRepository.delete(id);
  }
}
