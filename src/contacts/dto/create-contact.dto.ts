import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Roles } from 'src/common/enum/roles.enum';

export class CreateContactDto {
  @IsOptional()
  @IsString()
  recordID?: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsEnum(Roles)
  role: Roles;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}
