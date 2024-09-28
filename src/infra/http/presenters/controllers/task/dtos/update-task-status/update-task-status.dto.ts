import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '@core/task/enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, {
    message: 'Status must be either Pendente, Concluída, or Em Progresso',
  })
  @ApiProperty({
    description: 'The new status of the task.',
    enum: TaskStatus,
    enumName: 'TaskStatus',
    example: TaskStatus.PENDING,
  })
  status: TaskStatus;
}
