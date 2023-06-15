import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from '~users/entities/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: UserEntity, token: string) {
        this.mailerService.sendMail({
            to: user.email, // list of receivers
            subject: 'Testing Nest MailerModule ✔', // Subject line
            text: 'welcome', // plaintext body
            html: '<b>This is a test mail come from MHP server</b>' // HTML body content
        });
    }
}
