import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/user/entity/user.entity';
import { UserRole } from 'src/user/enum/user-role.enum';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { TrainingEntity } from '../entity/training.entity';

@Injectable()
export class TrainingService {
    constructor(
        @InjectRepository(TrainingEntity) 
        private trainingRepository: Repository<TrainingEntity>,
        private userService: UserService,
        @Inject(REQUEST) private readonly request: Request) {}

    async create(training: TrainingEntity, userId: string): Promise<TrainingEntity> {
        const user = await this.userService.getById(userId);
        delete user.password;
        training.user = user;
        return await this.trainingRepository.save(training);
    }

    async getByUserId(userId: string): Promise<TrainingEntity[]> {
        const user: User = this.request.user as User;

        let trainings = await this.trainingRepository.find({
            relations: ['participant', 'user', 'user.userDetails', 'participant.player', 'participant.player.userDetails'],
            where: {
                user: { id: userId },
            },
            order: {
                startDate: 'ASC'
            }
        });
        if (user.role === UserRole.PLAYER) {
            trainings = trainings.filter(training => !training.participant)
        }
        return trainings;
    }

    async getById(trainingId: string): Promise<TrainingEntity> {
        return await this.trainingRepository.findOne({ id: trainingId }, { relations: ['user', 'user.userDetails'] });
    }
}
