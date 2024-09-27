import { ApiProperty } from '@nestjs/swagger';

import { Tenant } from '@core/tenant/model';
import { BaseViewModel } from '@infra/http/presenters/view-models/base.view-model';

export class TenantVMResponse {
  @ApiProperty()
  tenantId: string;
}

export class TenantViewModel implements BaseViewModel {
  public static toHTTP(model: Tenant): TenantVMResponse {
    return {
      tenantId: model.id,
    };
  }

  public static toHTTPList(users: Tenant[]): TenantVMResponse[] {
    return users.map((user) => ({
      tenantId: user.id,
    }));
  }
}
