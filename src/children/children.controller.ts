import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { CreateChildrens } from './dto/create-children.dto';
import { ChildrenService } from './children.service';
import { CreateChildrensDto } from './dto/create-children.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppDataSource } from 'data-source/data-source';
import { Children } from './entity/children.entity';

@Controller('api/children')
export class ChildrenController {
    constructor(
        private childrenService: ChildrenService
    ) { }



    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    async delete(@Req() req: Request,@Query('id_children') id_children: number) {


        const user = req['user']; // pastikan pakai JWT guard
        const userId = user?.sub || user?.id;
        // const id_children = req['id_children']; // pastikan pakai JWT guard


        // return id_children
        const createUser = await this.childrenService.deleteChildren(userId,id_children);

        return {
            statusCode: HttpStatus.OK,
            message: 'success get list',
            data: createUser,
        };
    }


    @Get('list')
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request) {


        const user = req['user']; // pastikan pakai JWT guard
        const userId = user?.sub || user?.id;

        const createUser = await this.childrenService.listChildren(userId);

        return {
            statusCode: HttpStatus.OK,
            message: 'success get list',
            data: createUser,
        };
    }


    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads/children',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
    }))
    async add(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @Req() req: Request,
    ) {

        // return 'dwqdwqwq'
        const user = req['user'];
        const userId = user.sub || user.id;


        // return 'dwqdwq';
        // ✅ Manual Validation
        const requiredFields = [
            'fullname',
            'gender',
            'age_category',
            'school_day',
            'start_school_time',
            'end_school_time',
        ];

        const missingFields = requiredFields.filter((field) => !body[field]);

        if (missingFields.length > 0) {
            throw new BadRequestException(
                `Field(s) missing or empty: ${missingFields.join(', ')}`,
            );
        }

        if (!file) {
            throw new BadRequestException('Image is required');
        }

        // ✅ Build payload
        const payload = {
            fullname: body.fullname,
            gender: body.gender,
            age_category: body.age_category,
            school_day: body.school_day,
            start_school_time: body.start_school_time,
            end_school_time: body.end_school_time,
            profile_img: file.path,
        };

        const createUser = await this.childrenService.createChildrens(payload, userId);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'success create children',
            data: createUser,
        };
    }

}
