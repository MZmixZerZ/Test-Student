export class ResetPasswordCommand {
  constructor(
    public readonly username: string,
    public readonly newPassword: string,
  ) {}
}
