import { Body, Controller, Param, Patch } from '@nestjs/common';
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

type UpdateUserPasswordDto = {
  email: string;
  tenantId: string;
  newPassword: string;
  currentPassword: string;
};

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
    type: String,
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
  @Patch('users/:id/password')
  public async updateUserPassword(
    @Param('id') id: string,
    @Body() dto: UpdateUserPasswordDto,
  ): Promise<void> {
    await this.updateUserPasswordUseCase.execute({ ...dto, id });
  }
}
