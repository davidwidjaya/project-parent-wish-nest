import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService,GoogleStrategy],
  // imports: [
  //   UserModule,
  //   JwtModule.register({
  //     secret: '123123rrtfrtfrtfrtfr', // ganti sama env kalau production
  //     signOptions: { expiresIn: '1d' },
  //   }),
  // ],
})
export class AuthModule { }
