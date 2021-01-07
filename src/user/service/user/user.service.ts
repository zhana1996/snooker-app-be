import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { UserGenderEnum } from 'src/user/enum/user-gender.enum';
import { UserDetails } from 'src/user/entity/user-details.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>
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
    const user = await this.usersRepository.findOne({ id }, { relations: ['userDetails'] });
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

  async getAll(gender: UserGenderEnum): Promise<User[]> {
    let query = this.usersRepository.createQueryBuilder('users')
      .leftJoinAndSelect('users.userDetails', 'userDetails')
      .orderBy('userDetails.rank', 'ASC');
    
    if (gender) {
      query = query.where('userDetails.gender = :gender', { gender });
    }

    return query.getMany();
  }

  async updateUserDetails(userDetails: UserDetails): Promise<UserDetails> {
    const details = await this.getUserDetailsById(userDetails.id);

    await this.userDetailsRepository.update({ id: userDetails.id }, userDetails);

    return details;
  }

  async deleteById(userId: string): Promise<User> {
    const user = await this.getById(userId);
    const userDetails = await this.getUserDetailsById(user.userDetails.id);

    await this.userDetailsRepository.remove(userDetails);

    return user;
  }

  private async getUserDetailsById(id: string): Promise<UserDetails> {
    const userDetails = this.userDetailsRepository.findOne({ id });
    if (!userDetails) {
      throw new HttpException(
        'User details not found for the current user',
        HttpStatus.NOT_FOUND,
      );
    }
    return userDetails;
  }
}
