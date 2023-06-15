import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { MailService } from './services/mail.service';

@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            // imports: [ConfigModule], // import module if not enabled globally
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('MAIL_HOST'),
                    port: config.get('MAIL_PORT'),
                    secure: false,
                    auth: {
                        user: config.get('MAIL_USER'),
                        pass: config.get('MAIL_PASSWORD')
                    }
                },
                defaults: {
                    from: `"No Reply" <${config.get('MAIL_FROM')}>`
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}
