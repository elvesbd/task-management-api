import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  LoginDto,
  LoginResponseDto,
} from '@infra/http/presenters/controllers/authentication/dtos';
import { ApiPath, ApiTag } from '../constants';
import { Public } from '@infra/auth/decorators';
import { LoginUseCase } from '@core/authentication/usecases';

@Public()
@ApiTags(ApiTag)
@Controller(ApiPath)
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @ApiOperation({
    description: 'Authenticate user and return access token.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User credentials for login.',
  })
  @ApiCreatedResponse({
    description: 'Login successful, access token returned.',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials.',
  })
  @Post('login')
  public async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    const { accessToken } = await this.loginUseCase.execute(dto);

    return { accessToken };
  }
}
