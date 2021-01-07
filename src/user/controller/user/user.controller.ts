import { Controller, Post, Body, ValidationPipe, UseFilters, Put, Get, UseGuards, Query, ClassSerializerInterceptor, UseInterceptors, Patch, Delete } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { User } from '../../entity/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
//import { QueryFailedErrorFilter } from '../../../exception-filters/query-error.filter';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/user/enum/user-role.enum';
import { UserGenderEnum } from 'src/user/enum/user-gender.enum';
import { UserDetails } from 'src/user/entity/user-details.entity';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private userService: UserService) {}

    @Post('register')
    //@UseFilters(QueryFailedErrorFilter)
    async createUser(@Body(new ValidationPipe()) user: CreateUserDto): Promise<User> {
        return await this.userService.create(user);
    }

    @Put('change-password')
    async changePassword(@Body(new ValidationPipe()) changePassword: ChangePasswordDto): Promise<User> {
        return await this.userService.changePassword(changePassword);
    }

    @Get('all')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.PLAYER, UserRole.ADMIN, UserRole.TRAINER)
    async getAll(@Query('gender') gender: UserGenderEnum): Promise<User[]> {
        return await this.userService.getAll(gender);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.PLAYER, UserRole.ADMIN, UserRole.TRAINER)
    async getUserById(@Query('userId') userId: string): Promise<User> {
        return await this.userService.getById(userId);
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async deleteUserDetails(@Query('userId') userId: string): Promise<User> {
        return this.userService.deleteById(userId);
    }

    @Put('user-details')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateUserDetails(@Body() userDetails: UserDetails): Promise<UserDetails> {
        return this.userService.updateUserDetails(userDetails);
    }
}
