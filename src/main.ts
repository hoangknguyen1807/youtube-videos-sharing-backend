import { env } from '~config/env.config';

env.ROOT_PATH = __dirname; // Should be on top

import { NestFactory } from '@nestjs/core';
import { AppModule } from '~app.module';
import { BadRequestException } from '@nestjs/common';
import { ValidateException } from '~core/exceptions/validate.exception';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { EnvironmentSwagger } from '~swaggers/environment-swagger';
import { ValidationPipe } from '~core/http/pipes/validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            stopAtFirstError: true,
            exceptionFactory: (errors) => new ValidateException(errors)
        })
    );
    app.enableCors({
        origin: function (requestOrigin, callback) {
            if (!requestOrigin) {
                return callback(null, true);
            }
            requestOrigin = requestOrigin.replace('https://', '').replace('http://', '');
            if (env.WHITELIST_DOMAINS.indexOf(requestOrigin) !== -1) {
                return callback(null, true);
            } else {
                return callback(new BadRequestException(`No CORS allowed. Origin: ${requestOrigin}`), false);
            }
        }
    });
    app.useStaticAssets(path.join(env.ROOT_PATH, 'static'));
    new EnvironmentSwagger(app).buildDocuments();
    await app.listen(env.APP_PORT);
}

bootstrap()
    .then(() => console.log('Init app successfully'))
    .catch(console.error);
