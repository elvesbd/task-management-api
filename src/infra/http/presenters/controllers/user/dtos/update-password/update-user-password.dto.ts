import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
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
