import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { TorunamentParticipantEntity } from '../entity/tournament-participant.entity';

@Injectable()
export class TorunamentParticipantService {
  constructor(
    @InjectRepository(TorunamentParticipantEntity)
    private tournamentParticipantRepository: Repository<
      TorunamentParticipantEntity
    >,
    @Inject(REQUEST) private request: Request
  ) {}

  async apply(tournamentParticipant: TorunamentParticipantEntity): Promise<TorunamentParticipantEntity> {
    const player = this.request.user as User;
    delete player.password;

    tournamentParticipant.user = player;

    return await this.tournamentParticipantRepository.save(tournamentParticipant);
  }

  async delete(tournamentId: string): Promise<any> {
    const player = this.request.user as User;
    return await this.tournamentParticipantRepository.delete({ tournament: { id: tournamentId }, user: { id: player.id } });
  }
}
