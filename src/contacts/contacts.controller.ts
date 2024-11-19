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
  Query,
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
import { PaginationDto } from '../common/interface/pagination.dto';

@ApiTags('Contacts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  @Get('filter')
  async getFilteredContacts(
    @ActiveUser() user: ActiveUserInterface,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const filters = { name, email, phone };
    const pagination: PaginationDto = { page: +page, limit: +limit };

    return this.contactsService.getContactsFiltered(user, filters, pagination);
  }

  @Get('pagination')
  async getAllContactsPagination(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    if (!user.id || typeof user.id !== 'string') {
      throw new BadRequestException('Invalid or missing user ID');
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber <= 0 ||
      limitNumber <= 0
    ) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return this.contactsService.getAllContactsPagination(user, {
      page: pageNumber,
      limit: limitNumber,
    });
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

  @Get('phone/:phone')
  getContactByPhone(
    @Param('phone') phone: string,
    @ActiveUser() user: ActiveUserInterface,
  ): Promise<Contact> {
    return this.contactsService.getContactByPhone(phone, user);
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
