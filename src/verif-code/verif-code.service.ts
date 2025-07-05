import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, UseFilters } from '@nestjs/common';
import { VerifCodeDto } from './dto/verif-code.dto';
import { AppDataSource } from 'data-source/data-source';
import { User } from 'src/user/entity/user.entity';
import { VerifCodeEmail } from './entity/verif-code-email.entity';
import { use } from 'passport';
import { IsNull } from 'typeorm';
import { HttpExceptionFilter } from 'custom-validate/http-exception.filter';

@Injectable()
@UseFilters(new HttpExceptionFilter())

export class VerifCodeService {
    constructor(private mailerService: MailerService) { }


    async validataionCode(userId: number, code: string | number) {

        return await AppDataSource.transaction(async (manager) => {

            const userRepo = manager.getRepository(User);

            const verifRepo = manager.getRepository(VerifCodeEmail);

            const dataUser = await userRepo.findOneBy({ id_user: userId });

            if (!dataUser) { throw new BadRequestException('User not found'); }

            const tmp_code = Number(code);
            const dataCode = await verifRepo.findOneBy({ user_id: dataUser.id_user, code: tmp_code, deleted_at: IsNull(), type: 'verif_account' });

            if (!dataCode) { throw new BadRequestException('code invalid'); }

            const now = new Date();

            const tmp_data_core = {
                ...dataCode,
                deleted_at: now
            }


            await verifRepo.save(tmp_data_core);

            const tmp_user = {
                ...dataUser,
                step: "step_edit_profile",
                verified_at: now
            };

            const user = await userRepo.save(tmp_user);

            return user
            // return  // ✅ kalau semua sukses, ini yang dikembalikan
        });
    }


    async sendEmail(userId: number) {



        return await AppDataSource.transaction(async (manager) => {

            const userRepo = manager.getRepository(User);

            const verifRepo = manager.getRepository(VerifCodeEmail);

            const dataUser = await userRepo.findOneBy({ id_user: userId });

            if (!dataUser) { throw new BadRequestException('User not found'); }


            if (dataUser.step != "step_verif_code") {
                throw new BadRequestException('cant request code bcs u not in this step');
            }

            const generataCode = Math.floor(1000 + Math.random() * 9000);

            const to = dataUser.email;
            const subject = "Verification code";
            const content = "aplikasi test"
            // return generataCode
            await this.mailerService.sendMail({
                to,
                subject,
                text: content,
                html: `<b>you code is ${generataCode}</b>`, // opsional
            });

            const data = {
                code: generataCode,
                user_id: dataUser.id_user,
                type: "verif_account"

            };



            return await verifRepo.save(data); // ✅ kalau semua sukses, ini yang dikembalikan
        });
    }
}
