import { Body, Controller, Delete, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/enum/user-role.enum';
import { TorunamentParticipantEntity } from '../entity/tournament-participant.entity';
import { TorunamentParticipantService } from '../service/torunament-participant.service';

@Controller('torunament-participant')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TorunamentParticipantController {
    constructor(private tournamentParticipantService: TorunamentParticipantService) {}

    @Post()
    @Roles(UserRole.PLAYER, UserRole.TRAINER)
    async apply(@Body() tournamentParticipant: TorunamentParticipantEntity): Promise<TorunamentParticipantEntity> {
        return this.tournamentParticipantService.apply(tournamentParticipant);
    }

    @Delete()
    @Roles(UserRole.PLAYER, UserRole.TRAINER)
    async delete(@Query('tournamentId') tournamentId: string): Promise<TorunamentParticipantEntity> {
        return this.tournamentParticipantService.delete(tournamentId);
    }
}
