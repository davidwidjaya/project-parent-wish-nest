import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class ForgotPasswordDto {

    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    new_password: string

    @IsEmail()
    @IsNotEmpty()
    email: string;
}


export class SendForgotPassword {
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
}