import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { TournamentEntity } from '../entity/tournament.entity';
import { TournamentService } from '../service/tournament.service';

@Controller('tournament')
export class TournamentController {
    
    constructor(private tournamentService: TournamentService) {}
    
    @Post()
    async create(@Body() tournament: TournamentEntity): Promise<TournamentEntity> {
        return this.tournamentService.create(tournament);
    }

    @Get()
    async getAllByMonth(@Query('month') month: number, @Query('year') year: number, @Query('season') season: string): Promise<TournamentEntity[]> {
        return this.tournamentService.filterTournaments(month, year, season);
    }

    @Put()
    async update(@Body() tournament: TournamentEntity): Promise<TournamentEntity> {
        return this.tournamentService.update(tournament);
    }

    @Delete()
    async delete(@Query('tournamentId') tournamentId: string): Promise<TournamentEntity> {
        return this.tournamentService.delete(tournamentId);
    }
}
