import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/user/entity/user.entity';
import { Between, Brackets, Repository } from 'typeorm';
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
      const idx = earliestTournament.indexOf(Math.min(...earliestTournament));
      tournaments[idx].isEarliest = true;
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

    const tournament = await this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoinAndSelect('tournament.tournamentParticipants', 'tournamentParticipant')
      .where('tournament.startDate > :today', { today: new Date() })
      .andWhere(new Brackets(qb => {
        qb.where('tournamentParticipant.user.id = :userId', { userId: user.id })
          .orWhere('tournamentParticipant.id IS NULL')
      }))
      .orderBy('tournament.startDate')
      .limit(1)
      .getOne();
      
    const [days, hours, minutes] = this.parseDates(
      new Date().toISOString(),
      tournament.startDate.toISOString(),
    );
    
    return {
      tournament,
      days,
      hours,
      minutes,
    };
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
}

export const BetweenDate = (startDate: Date, endDate: Date) =>
  Between(startDate, endDate);
