import { BadRequestException, Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
// import { CreateChildrens } from './dto/create-children.dto';
import { AppDataSource } from 'data-source/data-source';
import { Children } from './entity/children.entity';
import { CreateChildrensDto } from './dto/create-children.dto';
import { HttpExceptionFilter } from 'custom-validate/http-exception.filter';

@Injectable()
@UseFilters(new HttpExceptionFilter())

export class ChildrenService {
    private childrenRepo = AppDataSource.getRepository(Children);

    async deleteChildren(userId: number, id_children: number) {
        const data = await this.childrenRepo.findOneBy({ id_children: id_children });

        if (!data) { throw new BadRequestException('Password salah'); }
        const now = new Date();

        data.deleted_at = now

        await this.childrenRepo.save(data)

        return data

    }

    async listChildren(userId: number) {
        const data = await this.childrenRepo.find({

            order: {
                created_at: 'ASC',
            },
            where: { user_id: userId },
        });

        // Ubah jadi full path
        const baseUrl = 'http://localhost:3000'; // ganti sesuai domain/port lo

        const formatted = data.map((child) => {
            return {
                ...child,
                profile_img: child.profile_img
                    ? `${baseUrl}/${child.profile_img.replace(/\\/g, '/')}`
                    : null,
            };
        });

        return formatted

    }

    async createChildrens(dto: CreateChildrensDto, userId: number) {
        return await AppDataSource.transaction(async (manager) => {
            const childrenRepo = manager.getRepository(Children);

            const data = {
                ...dto,
                user_id: userId
                // password: hashedPassword,
                // step: "step_verif_code",
            };

            const user = childrenRepo.create(data);

            const save = await childrenRepo.save(user);

            return save;
        });

    }
}
