// src/data-source.ts
import { Children } from 'src/children/entity/children.entity';
import { Task } from 'src/task/entity/task.entity';
import { User } from 'src/user/entity/user.entity';
import { VerifCodeEmail } from 'src/verif-code/entity/verif-code-email.entity';
import { DataSource } from 'typeorm';
// import { User } from './users/user.entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'project-david',
    entities: [User,VerifCodeEmail,Children,Task],
    synchronize: true, // false di production
});
