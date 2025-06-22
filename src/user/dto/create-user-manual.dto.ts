import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserManualDto {

    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;


    verifed_at?: Date;

}
