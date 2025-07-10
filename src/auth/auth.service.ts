import { BadRequestException, Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'data-source/data-source';
import { User } from 'src/user/entity/user.entity';
import { LoginManual } from './dto/login-manual.dto';
import { OAuth2Client } from 'google-auth-library';
import { HttpExceptionFilter } from 'custom-validate/http-exception.filter';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifCodeEmail } from 'src/verif-code/entity/verif-code-email.entity';
import { ForgotPasswordDto, SendForgotPassword } from './dto/forgot-password.dto';
import { IsNull } from 'typeorm';

@Injectable()
@UseFilters(new HttpExceptionFilter())

export class AuthService {
    private userRepo = AppDataSource.getRepository(User);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private mailerService: MailerService
    ) { }

    async forgotPassword(dto: ForgotPasswordDto) {

        return await AppDataSource.transaction(async (manager) => {

            const userRepo = manager.getRepository(User);

            const verifRepo = manager.getRepository(VerifCodeEmail);

            const dataUser = await userRepo.findOneBy({ email: dto.email });

            if (!dataUser) { throw new BadRequestException('User not found'); }

            const tmp_code = Number(dto.code);
            const dataCode = await verifRepo.findOneBy({ user_id: dataUser.id_user, code: tmp_code, deleted_at: IsNull(), type: 'forgot_password' });

            if (!dataCode) { throw new BadRequestException('code invalid'); }

            const now = new Date();

            const tmp_data_core = {
                ...dataCode,
                deleted_at: now
            }

            await verifRepo.save(tmp_data_core);

            const hashedPassword = await bcrypt.hash(dto.new_password, 10);

            dataUser.password = hashedPassword;

            const user = await userRepo.save(dataUser);

            return user
        });
    }

    async sendForgotPassword(dto: SendForgotPassword) {
        return await AppDataSource.transaction(async (manager) => {

            const userRepo = manager.getRepository(User);

            const verifRepo = manager.getRepository(VerifCodeEmail);

            const dataUser = await userRepo.findOneBy({ email: dto.email });

            if (!dataUser) { throw new BadRequestException('User not found'); }


            const generataCode = Math.floor(1000 + Math.random() * 9000);

            const to = dataUser.email;
            const subject = "Forgot Password";
            const content = "aplikasi test"

            // return generataCode
            await this.mailerService.sendMail({
                to,
                subject,
                text: content,
                html: `<b>you code  is https://api.parent-wish.com/reset-password?token=${generataCode}</b>`, // opsional
            });

            const data = {
                code: generataCode,
                user_id: dataUser.id_user,
                type: "forgot_password"
            };



            return await verifRepo.save(data); // ✅ kalau semua sukses, ini yang dikembalikan
        });
    }



    async login(dto: LoginManual) {
        const user = await this.userRepo.findOneBy({ email: dto.email });
        if (!user) throw new UnauthorizedException('Email tidak ditemukan');

        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) throw new UnauthorizedException('Password salah');

        const payload = { sub: user.id_user, email: user.email };
        const token = this.jwtService.sign(payload);

        return { token: token };
    }

    async authGoogle(idToken: string) {

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string); // client ID dari Google Console

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID as string, // validasi biar aman
        });

        const payload = ticket.getPayload();

        if (!payload) { throw new UnauthorizedException('failed verif login google'); }

        const email = payload.email;
        const name = payload.name;
        const sub = payload.sub;
        const picture = payload.picture;
        // return payload;

        const cekUser = await this.userRepo.findOneBy({ email: email });

        if (!cekUser) {
            const hashedPassword = await bcrypt.hash("45123453", 10);
            const now = new Date();
            const data = {
                username: email,
                fullname: name,
                email: email,
                password: hashedPassword,
                google_id: sub,
                profile_img: picture,
                step: "step_edit_profile",
                verified_at: now
            };

            const user = this.userRepo.create(data);

            const save = await this.userRepo.save(user);


            const payload = { sub: user.id_user, email: user.email };
            const token = this.jwtService.sign(payload);

            return { token: token };
        } else {
            const payload_data = { sub: cekUser.id_user, email: cekUser.email };
            const token = this.jwtService.sign(payload_data);

            if (cekUser.step == 'step_verif_code') {

                cekUser.step = "step_edit_profile"
                await this.userRepo.save(cekUser);
            }
            // cekUser.step = "";


            return { token: token, step: cekUser.step };
        }


    }
}
