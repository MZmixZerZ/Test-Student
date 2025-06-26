import { UpdateUserDto } from "../dtos/update-user.dto";

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly updateUserDto?: UpdateUserDto,
    public readonly updatedBy?: string,
  ) {}
}
