import * as bcrypt from 'bcrypt';

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { ConfigService } from '../../config/config.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
                private userService: UserService,
                private configService: ConfigService) {}

    async login(credentials: LoginUserDto) {
        const user = await this.userService.getByUsername(credentials.username);

        if (!user) {
            throw new NotFoundException('User not found!');
        }

        if (!user.isEnabled) {
            throw new HttpException('Your account must be approved by administrator!', HttpStatus.BAD_REQUEST);
        }

        if(!(await bcrypt.compare(credentials.password, user.password))) {
            throw new HttpException('Password is not correct!', HttpStatus.BAD_REQUEST);
        }

        const expiresIn = this.configService.get('TOKEN_MAX_AGE');
        const accessToken = this.jwtService.sign({ id: user.id, role: user.role }, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn,
        });

        return {
            expiresIn,
            accessToken,
            id: user.id
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        const user = await this.userService.getByEmail(forgotPasswordDto.email);
        if (!user) return;
        //const token = await this.tokenService.getActivationToken(user.email);
        const forgotLink = `test`;
    
        // const mailInfo = await this.mailService.sendMail({
        //   to: user.email,
        //   subject: 'Forgot Password',
        //   html: `
        //             <h3>Cześć ${user.username}!</h3>
        //             <p>Aby zresetować swoje hasło kliknij w <a href="${forgotLink}">link</a>.</p>
        //         `,
        // });

        //console.log(mailInfo);
      }
    
}
