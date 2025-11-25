import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiSuccessResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success: The request was successfully processed.',
    }),
  );
}

export function ApiInvalidInputResponse() {
  return applyDecorators(
    ApiResponse({ status: 400, description: 'Error: Invalid input provided.' }),
  );
}

export function ApiForbidenResponse() {
  return applyDecorators(
    ApiResponse({ status: 403, description: 'Error: Forbiden.' }),
  );
}

export function ApiNotFoundResponse() {
  return applyDecorators(
    ApiResponse({ status: 404, description: 'Error: Resource not found.' }),
  );
}

export function ApiQueryParams(
  params: {
    name: string;
    required: boolean;
    description?: string;
    example?: any;
  }[],
) {
  return applyDecorators(
    ...params.map((param) =>
      ApiQuery({
        name: param.name,
        required: param.required,
        description: param.description,
        example: param.example,
      }),
    ),
  );
}
