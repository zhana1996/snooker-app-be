import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { TournamentEntity } from '../entity/tournament.entity';

@Injectable()
export class TournamentService {
    constructor(
        @InjectRepository(TournamentEntity) 
        private tournamentRepository: Repository<TournamentEntity>) {}

    async create(tournament: TournamentEntity): Promise<TournamentEntity> {
        return await this.tournamentRepository.save(tournament);
    }

    async filterTournaments(month: number, year: number, season: string): Promise<TournamentEntity[]> {
        if (season) {
            return await this.tournamentRepository.find({
                where: {
                    season
                },
                order: {
                    startDate: 'DESC'
                }
            });
        }
        const date = new Date();
        date.setMonth(month);
        date.setFullYear(year);

        const firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        return await this.tournamentRepository.find({
            where: {
                startDate: BetweenDate(firstDay, lastDay)
            },
            order: {
                startDate: 'DESC'
            }
        });
    }

    async update(tournament: TournamentEntity): Promise<TournamentEntity> {
        await this.checkIfTournamentsExists(tournament.id);

        return await this.tournamentRepository.save(tournament);;
    }

    async delete(id: string): Promise<TournamentEntity> {
        const tournament = await this.checkIfTournamentsExists(id);
        return await this.tournamentRepository.remove(tournament);
    }

    private async checkIfTournamentsExists(id: string): Promise<TournamentEntity> {
        const foundTournament = await this.tournamentRepository.findOne({ id });
        if (!foundTournament) {
            throw new HttpException(
                `Tournament with id: ${id} not found`,
                HttpStatus.BAD_REQUEST,
              );
        }

        return foundTournament;
    }
}

export const BetweenDate = (startDate: Date, endDate: Date) => Between(startDate, endDate);
