import { Body, ClassSerializerInterceptor, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/enum/user-role.enum';
import { TrainingEntity } from '../entity/training.entity';
import { TrainingService } from '../service/training.service';

@Controller('training')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TrainingController {
    constructor(private trainingService: TrainingService) {}

    @Post()
    @Roles(UserRole.TRAINER)
    async create(
        @Body() training: TrainingEntity,
        @Query('userId') userId: string): Promise<TrainingEntity> {
        return this.trainingService.create(training, userId);
    }

    @Get()
    @Roles(UserRole.TRAINER, UserRole.PLAYER)
    async getByUserId(@Query('userId') userId: string): Promise<TrainingEntity[]> {
        return this.trainingService.getByUserId(userId);
    }
}
