import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './controller/user.controller';
import { UserDetails } from './entity/user-details.entity';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDetails])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
