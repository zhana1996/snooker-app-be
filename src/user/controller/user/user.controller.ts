import { Controller, Post, Body, ValidationPipe, UseFilters, Put, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { User, UserRole } from '../../entity/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
//import { QueryFailedErrorFilter } from '../../../exception-filters/query-error.filter';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.PLAYER)
    test(): string {
        return 'test';
    }
    
    @Post('register')
    //@UseFilters(QueryFailedErrorFilter)
    async createUser(@Body(new ValidationPipe()) user: CreateUserDto): Promise<User> {
        return await this.userService.create(user);
    }

    @Put('change-password')
    async changePassword(@Body(new ValidationPipe()) changePassword: ChangePasswordDto): Promise<User> {
        return await this.userService.changePassword(changePassword);
    }
}
