import { Body, Controller, Patch, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { UpdateUserUseCase } from '@core/user/usecases';
import { UpdateUserDto } from '@infra/http/presenters/controllers/user/dtos';
import {
  UserViewModel,
  UserVMResponse,
} from '@infra/http/presenters/view-models/user';
import { GetCurrentTenantId } from '@infra/auth/decorators';

@ApiBearerAuth()
@ApiTags(ApiTag)
@Controller(ApiPath)
export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  @ApiOperation({
    description: 'Update an existing user.',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'User data to update.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to be updated.',
    type: String,
  })
  @ApiOkResponse({
    description: 'User updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Tenant or User not found.',
  })
  @Patch(':id')
  public async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @GetCurrentTenantId() tenantId: string,
  ): Promise<UserVMResponse> {
    const user = await this.updateUserUseCase.execute({
      ...dto,
      id,
      tenantId,
    });

    return UserViewModel.toHTTP(user);
  }
}
