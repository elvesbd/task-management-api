import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

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
}
