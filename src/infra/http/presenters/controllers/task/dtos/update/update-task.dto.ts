import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsEmail()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsDateString()
  deadline: Date;

  @IsString()
  @IsOptional()
  tenantId: string;
}
