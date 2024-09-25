import { UserRole } from '@core/user/enum';

type User = {
  id?: string;
  email: string;
  role: UserRole;
  password: string;
  tenantId: string;
};

export class UserDataBuilder {
  private props: User = {
    email: 'test@example.com',
    role: UserRole.USER,
    password: 'securePassword',
    tenantId: '019229dc-e8c6-72cc-b599-c938df401967',
  };

  public static aUser(): UserDataBuilder {
    return new UserDataBuilder();
  }

  public withId(): this {
    this.props.id = 'userId123';
    return this;
  }

  public withEmail(email: string): this {
    this.props.email = email;
    return this;
  }

  public withRole(role: UserRole): this {
    this.props.role = role;
    return this;
  }

  public withPassword(password: string): this {
    this.props.password = password;
    return this;
  }

  public withTenantId(tenantId: string): this {
    this.props.tenantId = tenantId;
    return this;
  }

  public build(): User {
    return this.props;
  }
}
