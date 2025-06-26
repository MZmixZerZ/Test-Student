export class RequestUserDto {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  status: string;
  companies: [string];
  companySelected: string;
}
