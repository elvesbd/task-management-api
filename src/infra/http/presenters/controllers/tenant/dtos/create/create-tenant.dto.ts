import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Nome da Empresa',
    description: 'O nome do inquilino',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(14, 14, { message: 'O CNPJ deve ter exatamente 14 dígitos.' })
  @Matches(/^\d{14}$/, { message: 'O CNPJ deve conter apenas números.' })
  @ApiProperty({
    example: '77148298000106',
    description: 'O documento do inquilino (CNPJ)',
  })
  document: string;

  @IsEmail({}, { message: 'O e-mail deve ser um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail do administrador é obrigatório.' })
  @ApiProperty({
    example: 'admin@empresa.com',
    description: 'O e-mail do administrador da empresa',
  })
  adminEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha do administrador é obrigatória.' })
  @Length(6, 20, { message: 'A senha deve ter entre 6 e 20 caracteres.' })
  @ApiProperty({
    example: 'SenhaForte123',
    description: 'A senha do administrador da empresa',
  })
  adminPassword: string;
}
