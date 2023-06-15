import { env } from '~config/env.config';
import { ValueTransformer } from 'typeorm';

export class ImageTransformer implements ValueTransformer {
    to(value) {
        return value;
    }

    from(value) {
        if (value) {
            if (value.origin.startsWith('http')) {
                return value;
            }
            return {
                origin: env.BACKEND_URL + value.origin,
                thumbnail: env.BACKEND_URL + value.thumbnail
            };
        }
        return {
            origin: env.BACKEND_URL + '/assets/images/default-placeholder.jpg',
            thumbnail: env.BACKEND_URL + '/assets/images/default-placeholder.jpg'
        };
    }
}
