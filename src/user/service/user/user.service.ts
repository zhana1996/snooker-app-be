import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ChangePasswordDto } from '../../dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    if (!userData) {
      throw new HttpException(
        'Please provide all user data!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);

    return newUser;
  }


  async changePassword(changePassword: ChangePasswordDto): Promise<User> {
    const user = await this.usersRepository.findOne({ username: changePassword.username });

    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    user.password = changePassword.newPassword;
    return await this.usersRepository.save(user);
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new HttpException(
        'User with this ID does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getByUsername(username: string) {
    const user = await this.usersRepository.findOne({ username });
    if (!user) {
      throw new HttpException(
        'User with this username does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
}
