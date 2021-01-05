import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { ConfigModule } from '../config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy/jwt-strategy.service';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
