import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserManualDto } from 'src/user/dto/create-user-manual.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginManual } from './dto/login-manual.dto';
import { OAuth2Client } from 'google-auth-library';


@Controller('api/auth')
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
            message: 'success create user',
            data: createUser,
        };
    }
}
