import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { CreateTenantUseCase } from '@core/tenant/usecases';
import {
  TenantViewModel,
  TenantVMResponse,
} from '@infra/http/presenters/view-models/tenant';
import { CreateTenantDto } from '@infra/http/presenters/controllers/tenant/dtos';

@ApiTags(ApiTag)
@Controller(ApiPath)
export class CreateTenantController {
  constructor(private readonly createTenantUseCase: CreateTenantUseCase) {}

  @ApiOperation({
    description: 'Create a new tenant.',
  })
  @ApiBody({
    type: CreateTenantDto,
    description: 'Data to create a new tenant.',
  })
  @ApiCreatedResponse({
    description: 'Tenant created successfully.',
    type: TenantViewModel,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Tenant already exists with this document.',
  })
  @Post()
  public async createTenant(
    @Body() dto: CreateTenantDto,
  ): Promise<TenantVMResponse> {
    const tenant = await this.createTenantUseCase.execute(dto);

    return TenantViewModel.toHTTP(tenant);
  }
}
