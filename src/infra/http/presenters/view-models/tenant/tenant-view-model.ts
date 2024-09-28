import { ApiProperty } from '@nestjs/swagger';

import { Tenant } from '@core/tenant/model';
import { BaseViewModel } from '@infra/http/presenters/view-models/base.view-model';

export class TenantVMResponse {
  @ApiProperty({
    example: '01890c8c-aa4c-7a0c-95ab-12b5049b3f4a',
  })
  id: string;

  @ApiProperty({
    example: 'Nome da Empresa',
  })
  name: string;

  @ApiProperty({
    example: '77148298000106',
  })
  document: string;
}

export class TenantViewModel implements BaseViewModel {
  public static toHTTP(model: Tenant): TenantVMResponse {
    return {
      id: model.id,
      name: model.name,
      document: model.document,
    };
  }

  public static toHTTPList(users: Tenant[]): TenantVMResponse[] {
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      document: user.document,
    }));
  }
}
