import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Roles } from '../../common/enum/roles.enum';

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
  role?: Roles;

  @IsString()
  @IsOptional()
  latitude?: string;

  @IsString()
  @IsOptional()
  longitude?: string;
}
