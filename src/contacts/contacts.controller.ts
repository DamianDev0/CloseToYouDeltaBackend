import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { ActiveUserInterface } from '../common/interface/activeUserInterface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateContactsDto } from './dto/multipleContacts';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contacts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  getAllContacts(@ActiveUser() user: ActiveUserInterface): Promise<Contact[]> {
    return this.contactsService.getAllContacts(user);
  }

  @Get(':recordID')
  getContactById(
    @Param('recordID') recordID: string,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Contact> {
    return this.contactsService.getContactById(recordID, user);
  }

  @Get('name/:name')
  getContactByName(
    @Param('name') name: string,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Contact> {
    return this.contactsService.getContactByName(name, user);
  }

  @Get('phone/:phone')
  getContactByPhone(
    @Param('phone') phone: string,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Contact> {
    return this.contactsService.getContactByPhone(phone, user);
  }

  @Get('pagination/:page/:limit')
  async getAllContactsPagination(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    console.log('Pagination Params - Page:', page, 'Limit:', limit);
    console.log('User ID:', user.id);

    if (!user.id || typeof user.id !== 'string') {
      throw new BadRequestException('Invalid or missing user ID');
    }

    return this.contactsService.getAllContactsPagination(user, { page, limit });
  }
  @Post()
  async createMultipleContacts(
    @Body() createContactsDto: CreateContactsDto,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Contact[]> {
    return this.contactsService.createMultipleContacts(
      createContactsDto.contacts,
      user,
    );
  }

  @Post('oneContact')
  @UseInterceptors(FileInterceptor('photo'))
  async createOneContact(
    @Body() createContactDto: CreateContactDto,
    @ActiveUser() user: ActiveUserInterface,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Contact> {
    return this.contactsService.createContact(createContactDto, user, file);
  }

  @Patch(':recordID')
  @UseInterceptors(FileInterceptor('photo'))
  async updateContact(
    @Param('recordID') recordID: string,
    @Body() updateContactDto: UpdateContactDto,
    @ActiveUser() user: ActiveUserInterface,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Contact> {
    return this.contactsService.updateContact(
      recordID,
      updateContactDto,
      user,
      file,
    );
  }
  @Delete(':recordID')
  deleteContact(
    @Param('recordID') recordID: string,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<void> {
    return this.contactsService.deleteContact(recordID, user);
  }
}
