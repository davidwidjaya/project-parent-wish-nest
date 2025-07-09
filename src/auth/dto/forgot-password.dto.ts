import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class ForgotPasswordDto {

    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    new_password: string
}
