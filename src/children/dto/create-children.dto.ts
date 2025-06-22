import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateChildrensDto {

    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    age_category: string;

    @IsNotEmpty()
    school_day: string;

    @IsNotEmpty()
    start_school_time: string;


    @IsNotEmpty()
    end_school_time: string;

}
