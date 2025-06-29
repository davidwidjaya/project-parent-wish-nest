import { Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'data-source/data-source';
import { User } from 'src/user/entity/user.entity';
import { LoginManual } from './dto/login-manual.dto';
import { OAuth2Client } from 'google-auth-library';
import { HttpExceptionFilter } from 'custom-validate/http-exception.filter';

@Injectable()
@UseFilters(new HttpExceptionFilter())

export class AuthService {
    private userRepo = AppDataSource.getRepository(User);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

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
                step: "step_verif_code",
                verified_at : now
            };

            const user = this.userRepo.create(data);

            const save = await this.userRepo.save(user);


            const payload = { sub: user.id_user, email: user.email };
            const token = this.jwtService.sign(payload);

            return { token: token };
        } else {

            const payload_data = { sub: cekUser.id_user, email: cekUser.email };
            const token = this.jwtService.sign(payload_data);
            return { token: token };
        }


    }
}
