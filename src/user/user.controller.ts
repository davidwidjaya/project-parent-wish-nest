import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateUserManualDto } from './dto/create-user-manual.dto';
import { UserService } from './user.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('api/user')
export class UserController {

    constructor(
        private readonly usersService: UserService
    ) { }

    @Post('complete-profile')
    @HttpCode(HttpStatus.OK)
    async create(@Body() completeProfileDto: CompleteProfileDto, @Req() req: Request) {

        const user = req['user'];
        const userId = user.sub || user.id; // tergantung isi token-nya


        // return userId;

        const createUser = await this.usersService.completeProfile(completeProfileDto, userId);

        return {
            status_code: HttpStatus.OK,
            message: 'success complete profile',
            data: createUser,
        };
    }


    @Post('upload-image-profile')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/profile',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
            fileFilter: (req, file, cb) => {
                // Validasi file type
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 2 * 1024 * 1024, // 2MB
            },
        }),
    )

    async uploadProfileImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        const user = req['user']; // pastikan pakai JWT guard
        const userId = user?.sub || user?.id;

        const createUser = await this.usersService.changeImgProfile(file.path, userId);

        return {
            status_code: HttpStatus.OK,
            message: 'Image uploaded successfully',
            data: {
                filename: file.filename,
                path: file.path,
                userId,
            },
        };
    }
}
