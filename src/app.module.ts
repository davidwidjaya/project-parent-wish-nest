import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildrenModule } from './children/children.module';
import { VerifCodeModule } from './verif-code/verif-code.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './auth/auth.middleware';
import { TaskModule } from './task/task.module';
import * as dotenv from 'dotenv';
dotenv.config();

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '.well-known'),
      serveRoot: '/.well-known',
    }),
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
      port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10),
      username: process.env.DB_USERNAME || process.env.MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'project-david',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // sync only if not production
    }),
    ChildrenModule,
    VerifCodeModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'rahasia_jangan_bocor',
      signOptions: { expiresIn: '1d' },
    }),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        // proteksi route GET user/profile
        // { path: 'user/profile', method: RequestMethod.GET },

        // // proteksi semua route di /user/core
        // { path: 'api/auth/send-forgot-password', method: RequestMethod.POST },
        // { path: 'api/auth/forgot-password', method: RequestMethod.POST },

        { path: 'api/user/complete-profile', method: RequestMethod.POST },


        { path: 'api/verif-code/request-code', method: RequestMethod.POST },
        { path: 'api/verif-code/validation-code', method: RequestMethod.POST },


        { path: 'api/children/add', method: RequestMethod.POST },
        { path: 'api/children/list', method: RequestMethod.GET },


        { path: 'api/user/upload-image-profile', method: RequestMethod.POST },


        { path: 'api/task/add', method: RequestMethod.POST },
        { path: 'api/task/edit', method: RequestMethod.POST },
        { path: 'api/task/delete', method: RequestMethod.DELETE },
        { path: 'api/task/', method: RequestMethod.GET },

        // // proteksi 1 endpoint POST
        // { path: 'user/complete-profile', method: RequestMethod.POST },
      );
  }
}
