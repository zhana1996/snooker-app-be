import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from '../entity/news.entity';

@Injectable()
export class NewsService {
  constructor(@InjectRepository(NewsEntity)
  private newsRepository: Repository<NewsEntity>,) {}

  async create(tournament: NewsEntity): Promise<NewsEntity> {
    return await this.newsRepository.save(tournament);
  }

  async getAll(): Promise<NewsEntity[]> {
    return await this.newsRepository.find();
  }

  async delete(id: string): Promise<NewsEntity> {
    const news = await this.checkIfNewsExists(id);
    
    return await this.newsRepository.remove(news);
  }

  async update(news: NewsEntity): Promise<NewsEntity> {
    await this.checkIfNewsExists(news.id);

    return await this.newsRepository.save(news);
  }

  private async checkIfNewsExists(id: string): Promise<NewsEntity> {
    const foundNews = await this.newsRepository.findOne({ id });
    if (!foundNews) {
      throw new HttpException(
        `Tournament with id: ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return foundNews;
  }
}

