import {
  Body,
  Put,
  Param,
  HttpCode,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { GetCurrentTenantId } from '@infra/auth/decorators';
import { UpdateUserPasswordUseCase } from '@core/user/usecases';
import { UpdateUserPasswordDto } from '@infra/http/presenters/controllers/user/dtos';

@ApiBearerAuth()
@ApiTags(ApiTag)
@Controller(ApiPath)
export class UpdateUserPasswordController {
  constructor(
    private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase,
  ) {}

  @ApiOperation({
    description: 'Update user password.',
  })
  @ApiBody({
    type: UpdateUserPasswordDto,
    description: 'User email and passwords for update.',
  })
  @ApiOkResponse({
    description: 'Password updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiBadRequestResponse({
    description: 'Current password is incorrect.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/password')
  public async updateUserPassword(
    @Param('id') id: string,
    @Body() dto: UpdateUserPasswordDto,
    @GetCurrentTenantId() tenantId: string,
  ): Promise<void> {
    await this.updateUserPasswordUseCase.execute({ ...dto, id, tenantId });
  }
}
