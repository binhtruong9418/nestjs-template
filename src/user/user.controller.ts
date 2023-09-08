import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { BaseResponse } from 'src/shared/base.response.shared';
import { User } from './entities/user.entity';
import { GetUser } from 'src/shared/user.decorator';
import { PaginationDto } from 'src/shared/pagination.dto.shared';

@ApiResponse({ status: 500, description: 'Internal Server Error.' })
@ApiResponse({ status: 400, description: 'Bad Request.' })
@ApiResponse({ status: 401, description: 'Unauthorized.' })
@ApiResponse({ status: 403, description: 'Forbidden.' })
@ApiResponse({ status: 404, description: 'Not Found.' })
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Me' })
  @ApiOkResponse({
    description: 'Get me',
    type: BaseResponse,
  })
  @Get('/me')
  async getMe(@GetUser() user): Promise<User> {
    return await this.userService.getMe(user);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'All Users' })
  @ApiOkResponse({
    description: 'Get all users',
    type: BaseResponse,
  })
  @Get('/get-all')
  async getAllUser(@Query() pagination: PaginationDto): Promise<User[]> {
    return await this.userService.getAllUser(pagination);
  }
}
