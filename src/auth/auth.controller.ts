import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Render,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/base.response.shared';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ApiResponse({ status: 500, description: 'Internal Server Error.' })
@ApiResponse({ status: 400, description: 'Bad Request.' })
@ApiResponse({ status: 401, description: 'Unauthorized.' })
@ApiResponse({ status: 403, description: 'Forbidden.' })
@ApiResponse({ status: 404, description: 'Not Found.' })
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // users register
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({
    description: 'User registered successfully',
    type: BaseResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/register')
  async registerUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.authService.register(user);
  }

  // users login
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: BaseResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async loginUser(@Body() user: LoginUserDto): Promise<any> {
    return await this.authService.login(user);
  }
}
