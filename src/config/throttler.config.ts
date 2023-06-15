import { ThrottlerModule } from '@nestjs/throttler';
import { env } from './env.config';

export const throttlerConfig = ThrottlerModule.forRoot({
    ttl: env.THROTTLE.TTL,
    limit: env.THROTTLE.LIMIT
});
