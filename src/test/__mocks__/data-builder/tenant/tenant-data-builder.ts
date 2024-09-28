type Tenant = {
  id?: string;
  name: string;
  document: string;
  adminEmail: string;
  adminPassword: string;
};

export class TenantDataBuilder {
  private props: Tenant = {
    name: 'InovaTech Solutions',
    document: '41650433000170',
    adminEmail: 'admin@mail.com',
    adminPassword: 'cdf#8&789>62',
  };

  public static anTenant(): TenantDataBuilder {
    return new TenantDataBuilder();
  }

  public withId(): this {
    this.props.id = '019229dc-e8c6-72cc-b599-c938df401967';
    return this;
  }

  public withDocument(document: string): this {
    this.props.document = document;
    return this;
  }

  public withName(name: string): this {
    this.props.name = name;
    return this;
  }

  public build(): Tenant {
    return this.props;
  }
}
