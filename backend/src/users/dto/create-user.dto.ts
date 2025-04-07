import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string | null;

  @IsBoolean()
  @IsOptional()
  email_confirmed: boolean = false;

  @IsOptional()
  @IsString()
  verify_token?: string | null;

  @IsOptional()
  @IsString()
  reset_pass_token?: string | null;

  @IsOptional()
  @IsString()
  refresh_token?: string | null;

  @IsOptional()
  @IsString()
  access_token?: string | null;
}
