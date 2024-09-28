import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { DeleteTenantUseCase } from '@core/tenant/usecases';

@ApiTags(ApiTag)
@Controller(ApiPath)
export class DeleteTenantController {
  constructor(private readonly deleteTenantUseCase: DeleteTenantUseCase) {}

  @ApiOperation({
    description: 'Delete a tenant by ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the tenant to be deleted.',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Tenant not found.',
  })
  @ApiNoContentResponse({
    description: 'Tenant deleted successfully.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteTenant(@Param('id') id: string): Promise<void> {
    await this.deleteTenantUseCase.execute(id);
  }
}
