import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './controller/user.controller';
import { UserDetails } from './entity/user-details.entity';
import { UserService } from './service/user.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/file-storage/util/file-upload.utils';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDetails])
],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
