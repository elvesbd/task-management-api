import { Controller, Patch, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { UpdateTenantUseCase } from '@core/tenant/usecases';
import { UpdateTenantDto } from '@infra/http/presenters/controllers/tenant/dtos';
import {
  TenantViewModel,
  TenantVMResponse,
} from '@infra/http/presenters/view-models/tenant';

@ApiTags(ApiTag)
@Controller(ApiPath)
export class UpdateTenantController {
  constructor(private readonly updateTenantUseCase: UpdateTenantUseCase) {}

  @ApiOperation({
    description: 'Update an existing tenant.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the tenant to be updated.',
    type: String,
  })
  @ApiBody({
    type: UpdateTenantDto,
    description: 'Data to update the tenant.',
  })
  @ApiOkResponse({
    description: 'Tenant updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Tenant not found.',
  })
  @Patch(':id')
  public async updateTenant(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDto,
  ): Promise<TenantVMResponse> {
    const tenant = await this.updateTenantUseCase.execute({
      id,
      ...dto,
    });

    return TenantViewModel.toHTTP(tenant);
  }
}
