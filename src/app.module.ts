import { Module } from '@nestjs/common';
import { AppController } from '~app.controller';
import { AppSocket } from '~app.socket';
import { UserModule } from '~users/user.module';
import { databaseConfig } from '~config/database.config';
import { i18nConfig } from '~config/i18n.config';
import { GlobalCacheModule } from '~config/cache.config';
import { throttlerConfig } from '~config/throttler.config';
import { queueConfig } from '~config/queue.config';
import { scheduleConfig } from '~config/schedule.config';
import { CommandModule } from 'nestjs-command';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { HttpExceptionFilter } from '~core/filters/http-exception.filter';
import { MailModule } from '~mails/mail.module';
import { ConfigModule } from '@nestjs/config';
import { YouTubeVideosModule } from '~youtube-videos/youtube-videos.module';

const environment = process.env.NODE_ENV || 'development';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${environment}`,
            isGlobal: true
        }),
        databaseConfig,
        i18nConfig,
        throttlerConfig,
        queueConfig,
        scheduleConfig,

        GlobalCacheModule,
        CommandModule,
        MailModule,
        UserModule,
        YouTubeVideosModule
    ],
    controllers: [AppController],
    providers: [
        AppSocket,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
