import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Nova Tarefa',
    description: 'O título da tarefa.',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Descrição detalhada da tarefa.',
    description: 'A descrição da tarefa.',
  })
  description: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    example: '2024-09-30T23:59:59Z',
    description: 'Data limite para a conclusão da tarefa.',
  })
  deadline: Date;

  @IsUUID(7)
  @IsOptional()
  @ApiProperty({
    example: '01890c8c-aa4c-7a0c-95ab-12b5049b3f4a',
    description: 'O UUID do inquilino ao qual a tarefa pertence.',
  })
  tenantId: string;
}
