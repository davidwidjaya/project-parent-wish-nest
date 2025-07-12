// src/data-source.ts
import { Children } from 'src/children/entity/children.entity';
import { Task } from 'src/task/entity/task.entity';
import { User } from 'src/user/entity/user.entity';
import { VerifCodeEmail } from 'src/verif-code/entity/verif-code-email.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: (process.env.DB_HOST == null) ? process.env.DB_HOST : 'mysql.railway.internal',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    database: 'project-david',
    entities: [User,VerifCodeEmail,Children,Task],
    synchronize: process.env.NODE_ENV !== 'production', // false for production
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    logging: true, // Enable logging to debug connection issues
});