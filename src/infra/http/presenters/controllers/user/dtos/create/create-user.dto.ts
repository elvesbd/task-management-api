import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    example: 'user@example.com',
    description: 'O endereço de e-mail do usuário',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 128, { message: 'A senha deve ter entre 8 e 128 caracteres.' })
  @ApiProperty({
    example: 'strongPassword123',
    description: 'A senha do usuário, com no mínimo 8 caracteres.',
  })
  password: string;

  @IsUUID(7)
  @IsNotEmpty()
  @ApiProperty({
    example: '01890c8c-aa4c-7a0c-95ab-12b5049b3f4a',
    description: 'O UUID do inquilino ao qual o usuário pertence.',
  })
  tenantId: string;
}
