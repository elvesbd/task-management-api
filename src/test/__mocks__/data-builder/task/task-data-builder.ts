import { TaskStatus } from '@core/task/enum';

type Task = {
  id?: string;
  title: string;
  deadline: Date;
  tenantId: string;
  status: TaskStatus;
  description: string;
};

export class TaskDataBuilder {
  private props: Task = {
    title: 'Task 01',
    deadline: new Date(2024, 9, 27),
    description: 'Make supermarket',
    status: TaskStatus.INPROGRESS,
    tenantId: '019229dc-e8c6-72cc-b599-c938df401967',
  };

  public static aTask(): TaskDataBuilder {
    return new TaskDataBuilder();
  }

  public withId(): this {
    this.props.id = '019229dc-e8c6-22cc-b654-c938df401789';
    return this;
  }

  public withTitle(title: string): this {
    this.props.title = title;
    return this;
  }

  public withDeadline(deadline: Date): this {
    this.props.deadline = deadline;
    return this;
  }

  public withDescription(description: string): this {
    this.props.description = description;
    return this;
  }

  public withStatus(status: TaskStatus): this {
    this.props.status = status;
    return this;
  }

  public withTenantId(tenantId: string): this {
    this.props.tenantId = tenantId;
    return this;
  }

  public build(): Task {
    return this.props;
  }
}
