import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { FindByIdUserUseCase } from '@core/user/usecases';
import {
  UserViewModel,
  UserVMResponse,
} from '@infra/http/presenters/view-models/user';
import { GetCurrentTenantId } from '@infra/auth/decorators';

@ApiBearerAuth()
@ApiTags(ApiTag)
@Controller(ApiPath)
export class FindUserByIdController {
  constructor(private readonly findByIdUserUseCase: FindByIdUserUseCase) {}

  @ApiOperation({
    description: 'Find a user by ID within a specific tenant.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user to be found.',
    type: String,
  })
  @ApiOkResponse({
    description: 'User found successfully.',
    type: UserVMResponse,
  })
  @ApiNotFoundResponse({
    description: 'Tenant or User not found.',
  })
  @Get(':id')
  public async findByIdUser(
    @Param('id') id: string,
    @GetCurrentTenantId() tenantId: string,
  ): Promise<UserViewModel> {
    const user = await this.findByIdUserUseCase.execute({ id, tenantId });

    return UserViewModel.toHTTP(user);
  }
}
