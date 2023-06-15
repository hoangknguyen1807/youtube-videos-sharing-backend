import { ValueTransformer } from 'typeorm';

export class FloatTransformer implements ValueTransformer {
    to(value) {
        return value;
    }

    from(value) {
        return parseFloat(value);
    }
}
