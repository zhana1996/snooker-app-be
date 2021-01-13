import { editFileName, fileFilter } from './util/file-upload.utils';

import { FileStorageController } from './controller/file-storage.controller';
import { FileStorageService } from './service/file-storage.service';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: './uploads',
          filename: editFileName
        }),
        fileFilter: fileFilter
      })
    })
  ],
  controllers: [FileStorageController],
  providers: [FileStorageService]
})
export class FileStorageModule {}
