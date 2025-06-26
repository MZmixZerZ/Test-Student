export class SignInUserCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}
