// auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Token tidak ditemukan');

    try {
      const payload = this.jwtService.verify(token);
      req['user'] = payload;
      next();
    } catch (err) {
      throw new UnauthorizedException('Token tidak valid');
    }
  }
}
