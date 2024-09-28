import { IsEmail, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { UserRole } from '@core/user/enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    example: 'user@example.com',
    description: 'O endereço de e-mail do usuário',
  })
  email: string;

  @IsEnum(UserRole, {
    message: 'O valor do campo role deve ser um dos valores permitidos.',
  })
  @ApiProperty({
    example: 'Admin',
    description: 'O papel (role) do usuário dentro do sistema.',
    enum: UserRole,
  })
  role: UserRole;

  @IsUUID(7)
  @IsOptional()
  @ApiProperty({
    example: '01890c8c-aa4c-7a0c-95ab-12b5049b3f4a',
    description: 'O UUID do inquilino ao qual o usuário pertence.',
  })
  tenantId: string;
}
