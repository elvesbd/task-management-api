import { Entity } from '@core/shared/model';

export type TenantProps = {
  id?: string;
  name: string;
  document: string;
};

export class Tenant extends Entity<TenantProps> {
  private _name: string;
  private _document: string;

  constructor(props: TenantProps) {
    super(props);
    this._name = props.name;
    this._document = props.document;
  }

  static create(props: TenantProps): Tenant {
    return new Tenant(props);
  }

  public update(props: Pick<TenantProps, 'name' | 'document'>): void {
    this._name = props.name;
    this._document = props.document;
  }

  get name() {
    return this._name;
  }

  get document() {
    return this._document;
  }
}
