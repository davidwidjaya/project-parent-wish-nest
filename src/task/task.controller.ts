import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-children.dto';

@Controller('api/task')
export class TaskController {

    constructor(
        private readonly taskService: TaskService
    ) { }


    @Post('add')
    async add(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {

        // return "dwq";
        const user = req['user']; // pastikan pakai JWT guard
        const userId = user?.sub || user?.id;
        // const id_children = req['id_children']; // pastikan pakai JWT guard


        // return userId;


        const createUser = await this.taskService.createTask(createTaskDto, userId);

        return {
            status_code: HttpStatus.CREATED,
            message: 'success create task',
            data: createUser,
        };
    }

    @Post('edit')
    async edit(@Body() createTaskDto: CreateTaskDto, @Req() req: Request, @Query('id_task') id_task: number) {

        // return "dwq";
        const user = req['user']; // pastikan pakai JWT guard
        const userId = user?.sub || user?.id;
        // const id_children = req['id_children']; // pastikan pakai JWT guard


        // return userId;


        const createUser = await this.taskService.editTask(createTaskDto, userId, id_task);

        return {
            status_code: HttpStatus.OK,
            message: 'success create task',
            data: createUser,
        };

    }


    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    async delete(@Req() req: Request, @Query('id_task') id_task: number) {


        const user = req['user']; // pastikan pakai JWT guard
        const userId = user?.sub || user?.id;
        // const id_children = req['id_children']; // pastikan pakai JWT guard


        // return id_children
        const deleteUser = await this.taskService.deleteTask(userId, id_task);

        return {
            status_code: HttpStatus.OK,
            message: 'success delete',
            data: deleteUser,
        };
    }


    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Req() req: Request) {


        const user = req['user']; // pastikan pakai JWT guard
        const userId = user?.sub || user?.id;
        // const id_children = req['id_children']; // pastikan pakai JWT guard


        // return id_children
        const deleteUser = await this.taskService.listTask(userId);

        return {
            status_code: HttpStatus.OK,
            message: 'success get data',
            data: deleteUser,
        };
    }
}
