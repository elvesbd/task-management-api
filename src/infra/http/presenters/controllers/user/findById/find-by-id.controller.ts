import { Body, Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { FindByIdUserUseCase } from '@core/user/usecases';
import { UserViewModel } from '@infra/http/presenters/view-models/user';

type FindByIdUserDto = {
  tenantId: string;
};

@ApiTags(ApiTag)
@Controller(ApiPath)
export class FindByIdUserController {
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
  @ApiBody({
    type: String,
    description: 'User ID and Tenant ID.',
  })
  @ApiOkResponse({
    description: 'User found successfully.',
    type: UserViewModel,
  })
  @ApiNotFoundResponse({
    description: 'Tenant or User not found.',
  })
  @Get('users/:id')
  public async findByIdUser(
    @Param('id') id: string,
    @Body() dto: FindByIdUserDto,
  ): Promise<UserViewModel> {
    const user = await this.findByIdUserUseCase.execute({ ...dto, id });

    return UserViewModel.toHTTP(user);
  }
}
