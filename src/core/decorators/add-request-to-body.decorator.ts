import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { AddRequestToBodyInterceptor } from '../http/interceptors/add-request-to-body.interceptor';

export function AddRequestToBody() {
    return applyDecorators(UseInterceptors(AddRequestToBodyInterceptor));
}
