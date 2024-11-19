import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BcryptService } from '../common/services/bcrypt.service';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { UserController } from './user.controller';
import { AuthGuard } from '../auth/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    BcryptService,
    CloudinaryService,
    AuthGuard,
    JwtService,
  ],
  exports: [UserService],
})
export class UserModule {}
