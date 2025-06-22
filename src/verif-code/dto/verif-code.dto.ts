import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class VerifCodeDto {

    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    content: string
}
