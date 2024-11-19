import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BcryptService } from '../common/services/bcrypt.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUserInterface } from '../common/interface/activeUserInterface';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly cloudinaryService: CloudinaryService,
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

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    user: ActiveUserInterface,
    file?: Express.Multer.File,
  ): Promise<User> {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const existingUser = await this.UserRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      updateUserDto.photo = uploadResult.secure_url;
    }

    await this.UserRepository.save({ ...existingUser, ...updateUserDto });

    const updatedUser = await this.UserRepository.findOne({ where: { id } });
    return updatedUser;
  }

  async getActiveUser(user: ActiveUserInterface): Promise<User> {
    const activeUser = await this.UserRepository.findOne({
      where: { id: user.id },
    });
    if (!activeUser) {
      throw new NotFoundException('User not found');
    }
    return activeUser;
  }
}
