import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { VerifCodeService } from './verif-code.service';
import { VerifCodeDto } from './dto/verif-code.dto';
import { Code } from 'typeorm';

@Controller('api/verif-code')
export class VerifCodeController {
    constructor(private mailService: VerifCodeService) { }


    @Post('request-code')
    async send(@Req() req: Request) {

        const user = req['user'];
        // console.log(user)
        const userId = user?.sub || user.id; // tergantung isi token-nya

        // return userId;
        const data = await this.mailService.sendEmail( userId);

        return {
            status_code: HttpStatus.OK,
            message: 'success send code to email',
            data: data,
        };
    }


    @Post('validation-code')
    async validationCode(@Req() req: Request,@Body('code') code: string) {

        const user = req['user'];
        // console.log(user)
        const userId = user?.sub || user.id; // tergantung isi token-nya

        // return userId;
        const data = await this.mailService.validataionCode( userId,code);

        return {
            status_code: HttpStatus.OK,
            message: 'success validation code',
            data: data,
        };
    }
}
