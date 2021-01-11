import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './entity/news.entity';
import { NewsController } from './controller/news.controller';
import { NewsService } from './service/news.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsEntity])],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
