import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserManualDto } from 'src/user/dto/create-user-manual.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginManual } from './dto/login-manual.dto';
import { OAuth2Client } from 'google-auth-library';
import { HttpExceptionFilter } from 'custom-validate/http-exception.filter';
import { ForgotPasswordDto, SendForgotPassword } from './dto/forgot-password.dto';


@Controller('api/auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
    constructor(private readonly usersService: UserService, private readonly authService: AuthService) { }


    @Post('google/callback')
    @HttpCode(HttpStatus.OK)

    async loginWithGoogle(@Body('id_token') id_token: string) {

        const authGoogle = await this.authService.authGoogle(id_token);

        // Cek user di DB (atau bikin user baru)
        // return JWT atau session

        return {
            status_code: HttpStatus.OK,
            message: 'success login with google',
            data: authGoogle,
        };
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserManualDto) {

        const createUser = await this.usersService.createUser(createUserDto);

        return {
            status_code: HttpStatus.CREATED,
            message: 'success create user',
            data: createUser,
        };
    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginManualDto: LoginManual) {
        const createUser = await this.authService.login(loginManualDto);

        return {
            status_code: HttpStatus.OK,
            message: 'success login',
            data: createUser,
        };
    }



    @Post('send-forgot-password')
    @HttpCode(HttpStatus.OK)
    async sendForgotPassword(@Body() sendForgotPassowrdDto: SendForgotPassword) {


        // const user = req['user']; // pastikan pakai JWT guard
        // const userId = user?.sub || user?.id;
        // const id_children = req['id_children']; // pastikan pakai JWT guard

        const createUser = await this.authService.sendForgotPassword(sendForgotPassowrdDto);

        return {
            status_code: HttpStatus.OK,
            message: 'success send forgot password',
            data: createUser,
        };
    }


    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Req() req: Request, @Body() forgotPassowrdDto: ForgotPasswordDto) {
 

        // const user = req['user']; // pastikan pakai JWT guard
        // const userId = user?.sub || user?.id;
        // // const id_children = req['id_children']; // pastikan pakai JWT guard

        const createUser = await this.authService.forgotPassword(forgotPassowrdDto);

        return {
            status_code: HttpStatus.OK,
            message: 'success change password',
            data: null,
        };
    }
}
