import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { Roles } from '../../common/enum/roles.enum';
import { IsStringOrNumber } from './Valitator.dto';

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

  @Validate(IsStringOrNumber)
  @IsOptional()
  latitude?: string | number;

  @Validate(IsStringOrNumber)
  @IsOptional()
  longitude?: string | number;
}
