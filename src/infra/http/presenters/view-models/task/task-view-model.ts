import { Task } from '@core/task/model';
import { BaseViewModel } from '@infra/http/presenters/view-models/base.view-model';
import { ApiProperty } from '@nestjs/swagger';

export class TaskVMResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  deadline: Date;

  @ApiProperty()
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
