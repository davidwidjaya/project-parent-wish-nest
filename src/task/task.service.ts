import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-children.dto';
import { AppDataSource } from 'data-source/data-source';
import { Task } from './entity/task.entity';
import { User } from 'src/user/entity/user.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class TaskService {
    private taskRepo = AppDataSource.getRepository(Task);

    async createTask(dto: CreateTaskDto, userId: number) {
        return await AppDataSource.transaction(async (manager) => {

            const userRepo = manager.getRepository(User);

            const dataUser = await userRepo.findOneBy({ id_user: userId });

            if (!dataUser) { throw new BadRequestException('User not found'); }

            if (dataUser.verified_at == null) { throw new BadRequestException('Verif code first'); }

            const taskRepo = manager.getRepository(Task);

            const data = {
                ...dto,
                user_id: userId
                // password: hashedPassword,
                // step: "step_verif_code",
            };

            const user = taskRepo.create(data);
            const save = await taskRepo.save(user);

            return save;
        });
    }


    async listTask(userId: number) {
        const data = await this.taskRepo.findBy({ user_id: userId,deleted_at:IsNull() });
        return data

    }

    async deleteTask(userId: number, id_task: number) {
        const data = await this.taskRepo.findOneBy({ id_task: id_task });

        if (!data) { throw new BadRequestException('data not found'); }
        const now = new Date();

        data.deleted_at = now

        await this.taskRepo.save(data)

        return data

    }

    async editTask(dto: CreateTaskDto, userId: number, id_task: number) {
        return await AppDataSource.transaction(async (manager) => {

            const userRepo = manager.getRepository(User);

            const dataUser = await userRepo.findOneBy({ id_user: userId });

            if (!dataUser) { throw new BadRequestException('User not found'); }

            if (dataUser.verified_at == null) { throw new BadRequestException('Verif code first'); }

            const taskRepo = manager.getRepository(Task);


            const tmp_id_task = Number(id_task);
            const dataTask = await taskRepo.findOneBy({ user_id: dataUser.id_user, id_task: tmp_id_task, deleted_at: IsNull() });

            // return userId;
            if (!dataTask) { throw new BadRequestException('task invalid'); }

            const now = new Date();

            // const tmp_data_task = {
            //     ...dto,
            //     // deleted_at: now
            // }
            
            const save = await taskRepo.save(dto);

            return save;
        });
    }
}
