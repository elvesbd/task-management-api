import { Id } from '@core/shared/value-objects';

type EntityProps = {
  id?: string;
};

export class Entity<T> {
  protected _id: Id;

  constructor(props: T & EntityProps) {
    this._id = new Id(props?.id);
  }

  get id(): string {
    return this._id.value;
  }
}
