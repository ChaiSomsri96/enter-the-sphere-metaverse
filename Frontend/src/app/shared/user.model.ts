export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  jwtToken?: string;
  refreshToken:string;
	telegramId: string;
  role: string;
  uuid: string;
}
