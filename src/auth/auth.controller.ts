import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserManualDto } from 'src/user/dto/create-user-manual.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginManual } from './dto/login-manual.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly usersService: UserService,private readonly authService: AuthService) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() { }


    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserManualDto) {

        const createUser = await this.usersService.createUser(createUserDto);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'success create user',
            data: createUser,
        };
    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginManualDto: LoginManual) {
        const createUser = await this.authService.login(loginManualDto);

        return {
            statusCode: HttpStatus.OK,
            message: 'success create user',
            data: createUser,
        };
    }
}
