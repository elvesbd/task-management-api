import { Body, Controller, Delete, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiParam,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { DeleteUserUseCase } from '@core/user/usecases';

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
  @Delete(':id')
  public async deleteUser(
    @Param('id') id: string,
    @Body() body: { tenantId: string },
  ): Promise<void> {
    const input = {
      id,
      tenantId: body.tenantId,
    };

    await this.deleteUserUseCase.execute(input);
  }
}
