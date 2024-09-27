import { IsOptional, IsString } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  document: string;

  @IsString()
  @IsOptional()
  tenantId: string;
}
