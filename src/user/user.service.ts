import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BcryptService } from '../common/services/bcrypt.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.bcryptService.hashPassword(
      createUserDto.password,
    );
    const newUser = { ...createUserDto, password: hashedPassword };
    return this.UserRepository.save(newUser);
  }

  async findUserWithPassword(email: string): Promise<User> {
    const user = await this.UserRepository.findOne({
      where: { email },
      select: ['id', 'password'],
    });
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.UserRepository.delete(id);
  }
}
