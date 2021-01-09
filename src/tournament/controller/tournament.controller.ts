import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/enum/user-role.enum';
import { TournamentEntity } from '../entity/tournament.entity';
import { TournamentService } from '../service/tournament.service';

@Controller('tournament')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TournamentController {
    
    constructor(private tournamentService: TournamentService) {}
    
    @Post()
    @Roles(UserRole.ADMIN)
    async create(@Body() tournament: TournamentEntity): Promise<TournamentEntity> {
        return this.tournamentService.create(tournament);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.PLAYER, UserRole.TRAINER)
    async getAllByMonth(@Query('month') month: number, @Query('year') year: number, @Query('season') season: string): Promise<TournamentEntity[]> {
        return this.tournamentService.filterTournaments(month, year, season);
    }

    @Put()
    @Roles(UserRole.ADMIN)
    async update(@Body() tournament: TournamentEntity): Promise<TournamentEntity> {
        return this.tournamentService.update(tournament);
    }

    @Delete()
    @Roles(UserRole.ADMIN)
    async delete(@Query('tournamentId') tournamentId: string): Promise<TournamentEntity> {
        return this.tournamentService.delete(tournamentId);
    }
}
