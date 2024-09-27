import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ApiPath, ApiTag } from '../constants';
import { CreateUserUseCase } from '@core/user/usecases';
import {
  CreateUserDto,
  CreateUserResponseDto,
} from '@infra/http/presenters/controllers/user/dtos/create';
import { CreateUserViewModel } from '@infra/http/presenters/view-models/user';

@ApiTags(ApiTag)
@Controller(ApiPath)
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @ApiOperation({
    description: 'Create a new user.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data for creation.',
  })
  @ApiCreatedResponse({
    description: 'User created successfully.',
    type: CreateUserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Tenant not found.',
  })
  @Post('create')
  public async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const user = await this.createUserUseCase.execute(dto);

    return CreateUserViewModel.toHTTP(user);
  }
}
