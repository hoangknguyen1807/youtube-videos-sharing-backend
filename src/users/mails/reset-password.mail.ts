// import { env } from '~config/env.config';
// import path from 'path';

// export class ResetPasswordMail extends BaseMail {
//     constructor(private token: string, private email: string) {
//         super();
//     }

//     get subject(): string {
//         return 'Reset your iom-grievance password';
//     }

//     get template(): string {
//         return path.join(env.ROOT_PATH, 'users/resources/mails/reset-password.mail.hbs');
//     }

//     data() {
//         return {
//             token: this.token
//         };
//     }

//     get to(): string {
//         return this.email;
//     }
// }
