import { Module } from '@nestjs/common';
import { VerifCodeService } from './verif-code.service';
import { VerifCodeController } from './verif-code.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [VerifCodeController],
  providers: [VerifCodeService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // contoh pakai Gmail
        port: 465,
        secure: true,
        auth: {
          user: 'riskipatra5@gmail.com',
          pass: 'krty tddt pibs mnmh', // harus pakai App Password kalau pakai Gmail
        },
      },
      defaults: {
        from: '"Your App Name" <riskipatra5@gmail.com>',
      },
    }),
  ],
})
export class VerifCodeModule {}
