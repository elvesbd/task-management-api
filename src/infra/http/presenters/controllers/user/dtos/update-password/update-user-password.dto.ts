import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @IsUUID(7)
  @ApiProperty({
    example: '01890c8c-aa4c-7a0c-95ab-12b5049b3f4a',
    description: 'O UUID do inquilino ao qual o usuário pertence.',
  })
  tenantId: string;

  @IsString()
  @IsOptional()
  @Length(8, 128, {
    message: 'A nova senha deve ter entre 8 e 128 caracteres.',
  })
  @ApiProperty({
    example: 'newStrongPassword123',
    description: 'A nova senha do usuário, com no mínimo 8 caracteres.',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 128, {
    message: 'A senha atual deve ter entre 8 e 128 caracteres.',
  })
  @ApiProperty({
    example: 'currentPassword123',
    description: 'A senha atual do usuário, necessária para validação.',
  })
  currentPassword: string;
}
