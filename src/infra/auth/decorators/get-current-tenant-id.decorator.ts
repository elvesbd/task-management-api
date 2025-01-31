import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentTenantId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();

    return request.user['tenantId'];
  },
);
