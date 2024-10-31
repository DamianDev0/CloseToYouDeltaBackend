import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BcryptService } from '../common/services/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  private generateToken(user: any): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async registerUser(registerDto: RegisterDto): Promise<RegisterDto> {
    return this.userService.createUser(registerDto);
  }

  async loginUser({ username, password }: LoginDto) {
    const findUser = await this.userService.findUserWithPassword(username);

    if (!findUser) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await this.bcryptService.comparePassword(
      password,
      findUser.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = this.generateToken(findUser);
    return {
      accessToken,
      user: findUser,
    };
  }
}