import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/common/interface/activeUserInterface';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateContactsDto } from './dto/multipleContacts';

@ApiTags('Contacts')
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

  @Patch(':recordID')
  updateContact(
    @Param('recordID') recordID: string,
    @Body() updateContactDto: UpdateContactDto,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Contact> {
    return this.contactsService.updateContact(recordID, updateContactDto, user);
  }

  @Delete(':recordID')
  deleteContact(
    @Param('recordID') recordID: string,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<void> {
    return this.contactsService.deleteContact(recordID, user);
  }
}
