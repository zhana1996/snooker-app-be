import { Body, Controller, Post, Get, UseGuards, Delete, Query, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/enum/user-role.enum';
import { NewsEntity } from '../entity/news.entity';
import { NewsService } from '../service/news.service';

@Controller('news')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class NewsController {
    
    constructor(private newsService: NewsService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    async create(@Body() news: NewsEntity): Promise<NewsEntity> {
        return this.newsService.create(news);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.PLAYER, UserRole.TRAINER)
    async getAllNews(): Promise<NewsEntity[]> {
        return this.newsService.getAll();
    }

    @Delete()
    @Roles(UserRole.ADMIN)
    async delete(@Query('newsId') newsId: string): Promise<NewsEntity> {
        return this.newsService.delete(newsId);
    }

    @Put()
    @Roles(UserRole.ADMIN)
    async update(@Body() news: NewsEntity): Promise<NewsEntity> {
        return this.newsService.update(news);
    }
    
}
