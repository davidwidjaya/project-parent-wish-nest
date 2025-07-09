import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateTaskDto {

    @IsNotEmpty()
    task_name: string;

    @IsNotEmpty()
    task_desc: string;

    @IsNotEmpty()
    age_category: string;

    @IsNotEmpty()
    task_category: string;

    @IsNotEmpty()
    task_frequntly: string;

    @IsNotEmpty()
    task_vidio_url: string;
    
}
