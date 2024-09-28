import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Nome da Empresa',
    description: 'O nome do inquilino',
  })
  name: string;

  @IsString()
  @IsOptional()
  @Length(14, 14, { message: 'O CNPJ deve ter exatamente 14 dígitos.' })
  @Matches(/^\d{14}$/, { message: 'O CNPJ deve conter apenas números.' })
  @ApiProperty({
    example: '77148298000106',
    description: 'O documento do inquilino (CNPJ)',
  })
  document: string;
}
