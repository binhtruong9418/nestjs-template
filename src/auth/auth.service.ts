import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createAccessToken(email: string): Promise<string> {
    const user = await this.validateUser(email);
    const payload = { id: user.id, email: user.email };
    return await this.jwtService.signAsync({ payload });
  }

  async validateUser(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async register(userDto: CreateUserDto): Promise<User> {
    await this.validateRegister(userDto);
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    userDto.password = hashedPassword;
    const newUser = await this.userRepository.create(userDto);

    if (!newUser) {
      throw new InternalServerErrorException('Internal Server Error');
    }

    newUser.password = undefined;
    return newUser;
  }

  async login(user: LoginUserDto): Promise<any> {
    const { email, password } = user;
    const userExist = await this.userRepository.findOneByEmail(email);
    if (!userExist) {
      throw new NotFoundException("Email isn't registered");
    }
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Password isn't valid");
    }

    userExist.password = undefined;

    const token = await this.createAccessToken(email);
    return {
      access_token: token,
      user: userExist,
    };
  }

  async validateRegister(user: CreateUserDto): Promise<boolean> {
    const { email } = user;
    const userExist = await this.userRepository.findOneByEmail(email);
    if (userExist) {
      throw new BadRequestException('User already exists');
    }
    return true;
  }

  randomAlphaNumericString(length: number): string {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length),
      );
    }
    return result;
  }
}
