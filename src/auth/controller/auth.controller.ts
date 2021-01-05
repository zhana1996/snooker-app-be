import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ValidationPipe()) loginDto: LoginUserDto,
  ): Promise<any> {
    return await this.authService.login(loginDto);
  }

  @Post('forgot-password') 
  async forgotPassword(@Body(new ValidationPipe()) forgotPassword: ForgotPasswordDto){
    return await this.authService.forgotPassword(forgotPassword);
  }

  @Get('check')
  @UseGuards(AuthGuard('jwt'))
  check(): boolean {
      return true;
  }
}
