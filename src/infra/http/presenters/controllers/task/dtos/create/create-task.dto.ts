import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsEmail()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  deadline: Date;

  @IsString()
  @IsNotEmpty()
  tenantId: string;
}
