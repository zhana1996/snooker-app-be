import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/user/entity/user.entity';
import { Between, Brackets, MoreThan, Repository } from 'typeorm';
import { TournamentEntity } from '../entity/tournament.entity';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(TournamentEntity)
    private tournamentRepository: Repository<TournamentEntity>,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  async create(tournament: TournamentEntity): Promise<TournamentEntity> {
    return await this.tournamentRepository.save(tournament);
  }

  async filterTournaments(
    month: number,
    year: number,
    season: string,
  ): Promise<TournamentEntity[]> {
    if (season) {
      const tournaments = await this.tournamentRepository.find({
        where: {
          season,
        },
        order: {
          startDate: 'DESC',
        },
      });

      const earliestTournament = tournaments.map(transport => Math.abs(new Date().getTime() - transport.startDate.getTime()));
      if (earliestTournament) {
        const idx = earliestTournament.indexOf(Math.min(...earliestTournament));
        if (idx !== -1) {
          tournaments[idx].isEarliest = true;
        }
      }
      return tournaments;
    }
    const date = new Date();
    date.setMonth(month);
    date.setFullYear(year);

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    return await this.tournamentRepository.find({
      where: {
        startDate: BetweenDate(firstDay, lastDay),
      },
      order: {
        startDate: 'DESC',
      },
    });
  }

  async update(tournament: TournamentEntity): Promise<TournamentEntity> {
    await this.checkIfTournamentsExists(tournament.id);

    return await this.tournamentRepository.save(tournament);
  }

  async delete(id: string): Promise<TournamentEntity> {
    const tournament = await this.checkIfTournamentsExists(id);
    return await this.tournamentRepository.remove(tournament);
  }

  async getEarliest(): Promise<any> {
    const user = this.request.user as User;

    const tournament = await this.tournamentRepository.findOne({
      where: {
        startDate: MoreThan(new Date()),
      },
      relations: ['tournamentParticipants', 'tournamentParticipants.user'],
      order: {
        startDate: 'ASC'
      }
    })
    
    const isParticipating = tournament.tournamentParticipants.some(participate => participate.user.id === user.id);

    const [days, hours, minutes] = this.parseDates(
      new Date().toISOString(),
      tournament.startDate.toISOString(),
    );
    
    return {
      tournament,
      days,
      hours,
      minutes,
      isParticipating
    };
  }

  async getById(id: string): Promise<TournamentEntity> {
    return await this.tournamentRepository.findOne(id, { relations: ['tournamentParticipants', 'tournamentParticipants.user', 'tournamentParticipants.user.userDetails'] });
  }

  async shuffleAndGetPairs(id: string): Promise<{ players: User[][]; numberOnePlayer: User }> {
    const users = (await this.getById(id))?.tournamentParticipants.map(participant => {
      delete participant.user.password;
      return participant.user
    });

    return this.shufflePlayers(users);
  }

  private async checkIfTournamentsExists(
    id: string,
  ): Promise<TournamentEntity> {
    const foundTournament = await this.tournamentRepository.findOne({ id });
    if (!foundTournament) {
      throw new HttpException(
        `Tournament with id: ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return foundTournament;
  }

  private parseDates(fromValue: string, toValue: string): number[] {
    const fromMs = Date.parse(fromValue);
    const toMs = Date.parse(toValue);

    // Ensure that we have a valid date-range to work with.
    if (isNaN(fromMs) || isNaN(toMs) || fromMs > toMs) {
      throw new HttpException(
        'Invalid date range - no calculations to perform.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const deltaSeconds = (toMs - fromMs) / 1000;

    return this.calculateDaysHoursMinutesSeconds(deltaSeconds);
  }

  private calculateDaysHoursMinutesSeconds(delta: number): number[] {
    const days = Math.floor(delta / 60 / 60 / 24);
    const remainder = delta - days * 60 * 60 * 24;

    return [days, ...this.calculateHoursMinutesSeconds(remainder)];
  }

  private calculateHoursMinutesSeconds(delta: number): number[] {
    const hours = Math.floor(delta / 60 / 60);
    const remainder = delta - hours * 60 * 60;

    return [hours, ...this.calculateMinutesSeconds(remainder)];
  }

  private calculateMinutesSeconds(delta: number): number[] {
    const minutes = Math.floor(delta / 60);
    const remainder = delta - minutes * 60;

    return [minutes, ...this.calculateSeconds(remainder)];
  }

  // I calculate the delta breakdown using Second as the largest unit.
  private calculateSeconds(delta: number): number[] {
    return [delta];
  }

  private shufflePlayers(users: User[]): { players: User[][]; numberOnePlayer: User } {
    let numberOnePlayer: User;

    if (users.length % 2 !== 0) {
      numberOnePlayer = users.shift();
    }
    
    const usersArr = users.slice();

    usersArr.sort(() => 0.5 - Math.random());

    const players = usersArr.reduce((acc, item, index) => { 
      const i = Math.floor(index / 2);

      if(!acc[i]) {
        acc[i] = [];
      }

      acc[i].push(item);

      return acc;
    }, []);

    return { players, numberOnePlayer };
  }
}

export const BetweenDate = (startDate: Date, endDate: Date) =>
  Between(startDate, endDate);
