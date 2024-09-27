import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import {
  TenantViewModel,
  TenantVMResponse,
} from '@infra/http/presenters/view-models/tenant';
import { Tenant } from '@core/tenant/model';
import { ApiPath, ApiTag } from '../constants';
import { FindAllTenantUseCase } from '@core/tenant/usecases';

@ApiTags(ApiTag)
@Controller(ApiPath)
export class FindAllTenantsController {
  constructor(private readonly findAllTenantUseCase: FindAllTenantUseCase) {}

  @ApiOperation({
    description: 'Retrieve all tenants.',
  })
  @ApiOkResponse({
    description: 'Tenants retrieved successfully.',
    type: [Tenant],
  })
  @Get()
  public async findAllTenants(): Promise<TenantVMResponse[]> {
    const tenants = await this.findAllTenantUseCase.execute();

    return TenantViewModel.toHTTPList(tenants);
  }
}
