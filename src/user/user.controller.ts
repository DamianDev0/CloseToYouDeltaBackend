import {
  Controller,
  Patch,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UnauthorizedException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { ActiveUserInterface } from '../common/interface/activeUserInterface';
import { AuthGuard } from '../auth/guard/auth.guard';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('profile')
  async getActiveUser(@ActiveUser() user: ActiveUserInterface): Promise<User> {
    return this.userService.getActiveUser(user);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @ActiveUser() user: ActiveUserInterface,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.userService.updateUser(id, updateUserDto, user, file);
  }
}
