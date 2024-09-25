import { v7 as uuidv7 } from 'uuid';

export class Id {
  protected readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? uuidv7();
  }

  get value(): string {
    return this._value;
  }
}
