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

@Module({
  imports: [AuthModule, UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'project-david',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // set ke false di production
    }),
    ChildrenModule,
    VerifCodeModule,
    JwtModule.register({
      global: true, // ⬅️ ini bikin semua modul bisa akses JwtService
      secret: 'rahasia_jangan_bocor',
      signOptions: { expiresIn: '1d' },
    }),
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
        { path: 'api/user/complete-profile', method: RequestMethod.POST },

        { path: 'api/verif-code/request-code', method: RequestMethod.POST },
        { path: 'api/verif-code/validation-code', method: RequestMethod.POST },


        { path: 'api/children/add', method: RequestMethod.POST },

        // // proteksi 1 endpoint POST
        // { path: 'user/complete-profile', method: RequestMethod.POST },
      );
  }
}
