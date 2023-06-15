import {
    ArgumentMetadata,
    Injectable,
    Optional,
    ValidationPipe as BaseValidationPipe,
    ValidationPipeOptions
} from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { ParentDto } from '../dto/parent.dto';
import { RequestDto } from '../dto/request.dto';
import { TRANSFORMER_EXCLUDE_KEY } from '../validators/validate-if-or-exclude.validator';

@Injectable()
export class ValidationPipe extends BaseValidationPipe {
    private classValidator: any;
    private classTransformer: any;

    constructor(@Optional() options?: ValidationPipeOptions) {
        super(options);
        this.classValidator = this.loadValidator();
        this.classTransformer = this.loadTransformer();
    }

    public async transform(value: any, metadata: ArgumentMetadata) {
        if (this.expectedType) {
            metadata = { ...metadata, metatype: this.expectedType };
        }
        const metatype = metadata.metatype;
        if (!metatype || !this.toValidate(metadata)) {
            return this.isTransformEnabled ? this.transformPrimitive(value, metadata) : value;
        }
        const originalValue = value;
        value = this.toEmptyIfNil(value);

        const isNil = value !== originalValue;
        const isPrimitive = this.isPrimitive(value);
        this.stripProtoKeys(value);
        let entity = this.plainToClass(metatype, value);
        const originalEntity = entity;
        const isCtorNotEqual = entity.constructor !== metatype;

        if (isCtorNotEqual && !isPrimitive) {
            entity.constructor = metatype;
        } else if (isCtorNotEqual) {
            entity = { constructor: metatype };
        }
        const errors = await this.classValidator.validate(entity, this.validatorOptions);
        if (errors.length > 0) {
            throw await this.exceptionFactory(errors);
        }
        if (isPrimitive) {
            entity = originalEntity;
        }
        this.removeRequestData(entity);
        if (this.isTransformEnabled) {
            return entity;
        }
        if (isNil) {
            return originalValue;
        }
        return Object.keys(this.validatorOptions).length > 0
            ? this.classTransformer.classToPlain(entity, this.transformOptions)
            : value;
    }

    private removeRequestData(entity) {
        if (Array.isArray(entity)) {
            for (let item of entity) {
                this.removeRequestData(item);
            }
        } else if (isObject(entity)) {
            delete (entity as any).requestDto;
            delete (entity as any).parentDto;
            for (let key in entity) {
                this.removeRequestData(entity[key]);
            }
        }
    }

    private plainToClass(metatype, value) {
        let entity = this.classTransformer.plainToClass(metatype, value, this.transformOptions);
        this.addRequestToObject(entity, null, entity.requestDto);
        this.removeExcludedFields(entity, metatype);

        return entity;
    }

    private addRequestToObject(entity, parent, request) {
        if (Array.isArray(entity)) {
            for (let item of entity) {
                this.addRequestToObject(item, entity, request);
            }
        } else if (isObject(entity)) {
            if (entity instanceof RequestDto) {
                (entity as any).requestDto = request;
            }
            if (entity instanceof ParentDto) {
                (entity as any).parentDto = parent;
            }
            for (let key in entity) {
                if (key !== 'parentDto' && key !== 'requestDto') {
                    this.addRequestToObject(entity[key], entity, request);
                }
            }
        }
    }

    private removeExcludedFields(entity, metatype) {
        if (!metatype || !isObject(entity)) {
            return;
        }

        const metadatas = Reflect.getMetadata(TRANSFORMER_EXCLUDE_KEY, metatype) || [];
        const excludedFields = metadatas.filter((item) => !item.condition(entity)).map((item) => item.propertyName);
        for (const field of excludedFields) {
            delete entity[field];
        }

        for (const key in entity) {
            const value = entity[key];
            if (Array.isArray(value)) {
                for (const item of value) {
                    this.removeExcludedFields(item, item?.constructor);
                }
            } else if (isObject(value)) {
                this.removeExcludedFields(value, value.constructor);
            }
        }
    }
}
