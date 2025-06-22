import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
// import { CreateChildrens } from './dto/create-children.dto';
import { ChildrenService } from './children.service';
import { CreateChildrensDto } from './dto/create-children.dto';

@Controller('api/children')
export class ChildrenController {
    constructor(
        private childrenService : ChildrenService
    ) { }

    @Post('add')
    @HttpCode(HttpStatus.CREATED)
    async add(@Body() CreateChildrensDto:CreateChildrensDto, @Req() req: Request) {

        const user = req['user'];
        const userId = user.sub || user.id; // tergantung isi token-nya

        // return CreateChildrensDto;
        const createUser = await this.childrenService.createChildrens(CreateChildrensDto, userId);

        return {
            statusCode: HttpStatus.CREATED,
            message: 'success complete profile',
            data: createUser,
        };
    }
}
