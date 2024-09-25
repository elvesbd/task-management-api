import { Entity } from '@core/shared/model';
import { TaskStatus } from '@core/task/enum';

export type TaskProps = {
  id?: string;
  title: string;
  deadline: Date;
  tenantId: string;
  status: TaskStatus;
  description: string;
};

export class Task extends Entity<TaskProps> {
  private _title: string;
  private _deadline: Date;
  private _tenantId: string;
  private _status: TaskStatus;
  private _description: string;

  constructor(props: TaskProps) {
    super(props);
    this._title = props.title;
    this._status = props.status;
    this._deadline = props.deadline;
    this._tenantId = props.tenantId;
    this._description = props.description;
  }

  static create(props: TaskProps): Task {
    const status = TaskStatus.INPROGRESS;
    return new Task({ ...props, status });
  }

  public update(
    props: Pick<TaskProps, 'title' | 'deadline' | 'tenantId' | 'description'>,
  ): void {
    this._title = props.title;
    this._deadline = props.deadline;
    this._tenantId = props.tenantId;
    this._description = props.description;
  }

  public assignStatus(status: TaskStatus): void {
    this._status = status;
  }

  public get title(): string {
    return this._title;
  }

  public get deadline(): Date {
    return this._deadline;
  }

  public get tenantId(): string {
    return this._tenantId;
  }

  public get status(): TaskStatus {
    return this._status;
  }

  public get description(): string {
    return this._description;
  }
}
