import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { Roles } from '../../common/enum/roles.enum';
import { IsStringOrNumber } from './Valitator.dto';

export class CreateContactDto {
  @IsOptional()
  @IsString()
  recordID?: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MaxLength(15)
  phone: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  @IsEmail()
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
