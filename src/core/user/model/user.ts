import { Entity } from '@core/shared/model';
import { UserRole } from '@core/user/enum';

export type UserProps = {
  id?: string;
  email: string;
  role: UserRole;
  password: string;
  tenantId: string;
};

export class User extends Entity<UserProps> {
  private _email: string;
  private _role: UserRole;
  private _password: string;
  private _tenantId: string;

  constructor(props: UserProps) {
    super(props);
    this._role = props.role;
    this._email = props.email;
    this._password = props.password;
    this._tenantId = props.tenantId;
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  public update(props: Pick<UserProps, 'role' | 'email' | 'tenantId'>): void {
    this._role = props.role;
    this._email = props.email;
    this._tenantId = props.tenantId;
  }

  public updatePassword(hashedPassword: string): void {
    this._password = hashedPassword;
  }

  get role(): string {
    return this._role;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get tenantId(): string {
    return this._tenantId;
  }
}
