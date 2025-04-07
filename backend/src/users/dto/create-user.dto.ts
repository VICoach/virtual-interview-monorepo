import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  first_name: string | null;

  @IsString()
  @IsOptional()
  last_name: string | null;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

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
