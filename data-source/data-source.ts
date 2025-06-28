// src/data-source.ts
import { Children } from 'src/children/entity/children.entity';
import { User } from 'src/user/entity/user.entity';
import { VerifCodeEmail } from 'src/verif-code/entity/verif-code-email.entity';
import { DataSource } from 'typeorm';
// import { User } from './users/user.entity';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, VerifCodeEmail, Children],
    synchronize: true, // false for production
});

