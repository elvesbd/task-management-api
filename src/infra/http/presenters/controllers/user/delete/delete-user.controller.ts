import {
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { DeleteUserUseCase } from '@core/user/usecases';
import { GetCurrentTenantId } from '@infra/auth/decorators';

@ApiBearerAuth()
@ApiTags(ApiTag)
@Controller(ApiPath)
export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  @ApiOperation({
    description: 'Delete a user by ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to delete.',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'User or tenant not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized to perform this operation.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteUser(
    @Param('id') id: string,
    @GetCurrentTenantId() tenantId: string,
  ): Promise<void> {
    await this.deleteUserUseCase.execute({ id, tenantId });
  }
}
