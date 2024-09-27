import { Body, Controller, Param, Patch, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { UpdateUserPasswordUseCase } from '@core/user/usecases';
import { UpdateUserPasswordDto } from '@infra/http/presenters/controllers/user/dtos';

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
  @Put(':id/password')
  public async updateUserPassword(
    @Param('id') id: string,
    @Body() dto: UpdateUserPasswordDto,
  ): Promise<void> {
    await this.updateUserPasswordUseCase.execute({ ...dto, id });
  }
}
