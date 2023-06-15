import { Type } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { TRANSFORMER_EXCLUDE_KEY } from '~core/http/validators/validate-if-or-exclude.validator';

function inheritValidateIfOrExcludeMetadata<T>(classRef: Type<T>, targetClass: Type<Partial<T>>) {
    const excludeMetadataStorage = Reflect.getMetadata(TRANSFORMER_EXCLUDE_KEY, classRef);
    if (excludeMetadataStorage) {
        Reflect.defineMetadata(TRANSFORMER_EXCLUDE_KEY, excludeMetadataStorage, targetClass);
    }
}

export function CustomPartialType<T>(classRef: Type<T>): Type<Partial<T>> {
    const partialTypeClass = PartialType(classRef);

    inheritValidateIfOrExcludeMetadata<T>(classRef, partialTypeClass);

    return partialTypeClass;
}
