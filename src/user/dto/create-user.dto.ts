import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { UserDetails } from '../entity/user-details.entity';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
  
    @IsString()
    @IsNotEmpty()
    readonly username: string;
  
    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly userDetails: UserDetails;
}