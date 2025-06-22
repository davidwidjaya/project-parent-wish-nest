import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'data-source/data-source';
import { User } from 'src/user/entity/user.entity';
import { LoginManual } from './dto/login-manual.dto';

@Injectable()
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

        return { access_token: token };
    }
}
