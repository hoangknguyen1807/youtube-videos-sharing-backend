import { env } from '~config/env.config';

env.ROOT_PATH = __dirname;

import { NestFactory } from '@nestjs/core';
import { AppModule } from '~app.module';
import { CommandModule, CommandService } from 'nestjs-command';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const commandService: CommandService = app.select(CommandModule).get(CommandService, { strict: true });
    await commandService.exec();
    await app.close();
}

bootstrap()
    .then(() => console.log('Init app success'))
    .catch(console.error);
