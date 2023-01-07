import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Invalid email' })
	email: string;

	@IsString({ message: 'Invalid password' })
	password: string;

	@IsString({ message: 'Invalid name' })
	name: string;
}
