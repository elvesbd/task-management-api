import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';

import { Tenant } from '@core/tenant/model';
import { ApiPath, ApiTag } from '../constants';
import { FindByIdTenantUseCase } from '@core/tenant/usecases';
import {
  TenantViewModel,
  TenantVMResponse,
} from '@infra/http/presenters/view-models/tenant';

@ApiTags(ApiTag)
@Controller(ApiPath)
export class FindByIdTenantController {
  constructor(private readonly findByIdTenantUseCase: FindByIdTenantUseCase) {}

  @ApiOperation({
    description: 'Retrieve a tenant by ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the tenant to be found.',
    type: String,
  })
  @ApiOkResponse({
    description: 'Tenant retrieved successfully.',
    type: Tenant,
  })
  @ApiNotFoundResponse({
    description: 'Tenant not found.',
  })
  @Get('tenants/:id')
  public async findByIdTenant(
    @Param('id') id: string,
  ): Promise<TenantVMResponse> {
    const tenant = await this.findByIdTenantUseCase.execute(id);

    return TenantViewModel.toHTTP(tenant);
  }
}
