import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  password: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  photo?: string;
}
