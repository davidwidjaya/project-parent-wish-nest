import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CompleteProfileDto {

    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    date_of_birth: string;

    @IsNotEmpty()
    are_you_a: string;
    
    @IsNotEmpty()
    timezone: string;
}
