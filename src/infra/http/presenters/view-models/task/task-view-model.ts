import { ApiProperty } from '@nestjs/swagger';
import { Task } from '@core/task/model';
import { BaseViewModel } from '@infra/http/presenters/view-models/base.view-model';

export class TaskVMResponse {
  @ApiProperty({
    example: '01890c8c-aa4c-7a0c-95ab-12b5049b3f4a',
    description: 'O UUID da task.',
  })
  id: string;

  @ApiProperty({
    example: 'Nova Tarefa',
    description: 'O título da tarefa.',
  })
  title: string;

  @ApiProperty({
    example: 'Concluída',
    description: 'O status da tarefa dentro do sistema.',
  })
  status: string;

  @ApiProperty({
    example: 'Descrição detalhada da tarefa.',
    description: 'A descrição da tarefa.',
  })
  description: string;

  @ApiProperty({
    example: '2024-09-30T23:59:59Z',
    description: 'Data limite para a conclusão da tarefa.',
  })
  deadline: Date;

  @ApiProperty({
    example: '01890c8c-aa4c-7a0c-95ab-12b5049b3f4a',
    description: 'O UUID do inquilino ao qual a tarefa pertence.',
  })
  tenantId: string;
}

export class TaskViewModel implements BaseViewModel {
  public static toHTTP(model: Task): TaskVMResponse {
    return {
      id: model.id,
      title: model.title,
      status: model.status,
      deadline: model.deadline,
      tenantId: model.tenantId,
      description: model.description,
    };
  }

  public static toHTTPList(users: Task[]): TaskVMResponse[] {
    return users.map((user) => ({
      id: user.id,
      title: user.title,
      status: user.status,
      deadline: user.deadline,
      tenantId: user.tenantId,
      description: user.description,
    }));
  }
}
