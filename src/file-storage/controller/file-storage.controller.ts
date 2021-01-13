import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('file-storage')
export class FileStorageController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: any) {
        return file;
    }

    @Get(':imgpath')
    seeUploadedFile(@Param('imgpath') image: string, @Res() res: Response) {
      return res.sendFile(image, { root: 'C:/Users/Zhana Mitova/snooker-app-be/uploads' });
    }
}
