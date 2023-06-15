import { CacheModule, Global, Module } from '@nestjs/common';
import redisStore from 'cache-manager-redis-store';
import { env } from './env.config';

export const cacheConfig = CacheModule.register({
    store: redisStore,
    host: env.REDIS.HOST,
    port: env.REDIS.PORT
});

@Global()
@Module({
    exports: [cacheConfig],
    imports: [cacheConfig]
})
export class GlobalCacheModule {}
