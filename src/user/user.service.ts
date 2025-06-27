import { BadRequestException, Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { AppDataSource } from 'data-source/data-source';
import { User } from './entity/user.entity';
import { CreateUserManualDto } from './dto/create-user-manual.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import * as bcrypt from 'bcrypt';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from 'custom-validate/http-exception.filter';

@Injectable()
@UseFilters(new HttpExceptionFilter())
export class UserService {
    // private userRepo = AppDataSource.getRepository(User);


    constructor(
        // private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async createUser(dto: CreateUserManualDto) {

        return await AppDataSource.transaction(async (manager) => {
            const userRepo = manager.getRepository(User);

            const cekDuplicateUsername = await userRepo.findOneBy({ username: dto.username });
            if (cekDuplicateUsername) {
                throw new BadRequestException('Username duplicate');
            }

            const cekDuplicateEmail = await userRepo.findOneBy({ email: dto.email });
            if (cekDuplicateEmail) {
                throw new BadRequestException('Email duplicate');
            }

            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const now = new Date();

            const data = {
                ...dto,
                password: hashedPassword,
                step: "step_verif_code",
            };

            const user = userRepo.create(data);

            const save = await userRepo.save(user);


            const payload = { sub: user.id_user, email: user.email };
            const token = this.jwtService.sign(payload);


            const result = {
                ...save,
                token
            }


            return result;
        });
    }


    async completeProfile(dto: CompleteProfileDto, userId: number) {

        return await AppDataSource.transaction(async (manager) => {

            const userRepo = manager.getRepository(User);

            const dataUser = await userRepo.findOneBy({ id_user: userId });

            if (!dataUser) { throw new BadRequestException('User not found'); }

            if (dataUser.verified_at == null) { throw new BadRequestException('Verif code first'); }

            dataUser.fullname = dto.fullname;
            dataUser.date_of_birth = dto.date_of_birth;
            dataUser.are_you_a = dto.are_you_a;
            dataUser.timezone = dto.timezone;

            dataUser.step = "step_completed";

            return await userRepo.save(dataUser); // ✅ kalau semua sukses, ini yang dikembalikan
        });
    }

    async changeImgProfile(path : string , userId :number){
        return await AppDataSource.transaction(async (manager) => {

            
            console.log('dwq');

            const userRepo = manager.getRepository(User);

            const dataUser = await userRepo.findOneBy({ id_user: userId });

            if (!dataUser) { throw new BadRequestException('User not found'); }


            console.log(userId);
            if (dataUser.verified_at == null) { throw new BadRequestException('Verif code first'); }

            dataUser.profile_img = path;

            return await userRepo.save(dataUser); // ✅ kalau semua sukses, ini yang dikembalikan
        });
    }
}
