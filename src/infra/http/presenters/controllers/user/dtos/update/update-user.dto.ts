import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@core/user/enum';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @IsString()
  @IsOptional()
  tenantId: string;
}
