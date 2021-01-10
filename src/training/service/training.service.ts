import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { TrainingEntity } from '../entity/training.entity';

@Injectable()
export class TrainingService {
    constructor(
        @InjectRepository(TrainingEntity) 
        private trainingRepository: Repository<TrainingEntity>,
        private userService: UserService) {}

    async create(training: TrainingEntity, userId: string): Promise<TrainingEntity> {
        const user = await this.userService.getById(userId);
        delete user.password;
        training.user = user;
        return await this.trainingRepository.save(training);
    }

    async getByUserId(userId: string): Promise<TrainingEntity[]> {
        return await this.trainingRepository.find({
            where: {
                user: { id: userId }
            },
            relations: ['participant', 'user', 'user.userDetails', 'participant.player']
        });
    }

    async getById(trainingId: string): Promise<TrainingEntity> {
        return await this.trainingRepository.findOne({ id: trainingId });
    }
}
