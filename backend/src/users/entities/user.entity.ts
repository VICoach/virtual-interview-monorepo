import {
  IsNumber,
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { AccountType } from '@prisma/client'; // Use Prisma's enum

export class User {
  @IsNumber()
  user_id: number;

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
  @Exclude() // Exclude this field from the response
  password: string;

  @IsBoolean()
  email_confirmed: boolean;

  @IsString()
  @IsOptional()
  @Exclude()
  verify_token: string | null;

  @IsString()
  @IsOptional()
  @Exclude()
  reset_pass_token: string | null;

  @IsString()
  @IsOptional()
  @Exclude()
  refresh_token: string | null;

  @IsString()
  @IsOptional()
  @Exclude()
  access_token: string | null;

  @IsArray()
  accountType: AccountType[];

  /**
   * Constructor to create a User instance from a plain object
   */
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
