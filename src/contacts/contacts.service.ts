import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ActiveUserInterface } from '../common/interface/activeUserInterface';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { PaginationDto } from '../common/interface/pagination.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAllContacts(user: ActiveUserInterface): Promise<Contact[]> {
    return this.contactsRepository.find({ where: { user: { id: user.id } } });
  }

  async getContactById(
    recordID: string,
    user: ActiveUserInterface,
  ): Promise<Contact> {
    const contact = await this.contactsRepository.findOne({
      where: { recordID, user: { id: user.id } },
    });
    if (!contact)
      throw new NotFoundException(`Contact with id ${recordID} not found`);
    return contact;
  }

  async getContactByName(
    name: string,
    user: ActiveUserInterface,
  ): Promise<Contact> {
    const contact = await this.contactsRepository.findOne({
      where: { name, user: { id: user.id } },
    });
    if (!contact)
      throw new NotFoundException(`Contact with name ${name} not found`);
    return contact;
  }

  async getContactByPhone(
    phone: string,
    user: ActiveUserInterface,
  ): Promise<Contact> {
    const contact = await this.contactsRepository.findOne({
      where: { phone, user: { id: user.id } },
    });
    if (!contact)
      throw new NotFoundException(`Contact with phone ${phone} not found`);
    return contact;
  }

  async createContact(
    createContactDto: CreateContactDto,
    user: ActiveUserInterface,
    file?: Express.Multer.File,
  ): Promise<Contact> {
    try {
      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        createContactDto.photo = uploadResult.secure_url;
      }
      const contact = this.contactsRepository.create({
        ...createContactDto,
        user: { id: user.id },
      });

      return await this.contactsRepository.save(contact);
    } catch (error) {
      console.error('Error al crear el contacto:', error);
      throw new Error('No se pudo crear el contacto');
    }
  }

  async createMultipleContacts(
    contacts: CreateContactDto[],
    user: ActiveUserInterface,
  ): Promise<Contact[]> {
    const createdContacts: Contact[] = [];
    for (let i = 0; i < contacts.length; i++) {
      try {
        const contact = await this.createContact(contacts[i], user);
        createdContacts.push(contact);
      } catch (error) {
        console.error(`Error creating the contact ${contacts[i].name}:`, error);
      }
    }
    return createdContacts;
  }

  async updateContact(
    id: string,
    updateContactDto: UpdateContactDto,
    user: ActiveUserInterface,
    file?: Express.Multer.File,
  ): Promise<Contact> {
    if (!user) throw new UnauthorizedException('User not authenticated');

    const contact = await this.getContactById(id, user);
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      updateContactDto.photo = uploadResult.secure_url;
    }

    return this.contactsRepository.save({
      ...contact,
      ...updateContactDto,
    });
  }

  async deleteContact(id: string, user: ActiveUserInterface): Promise<void> {
    await this.getContactById(id, user);
    await this.contactsRepository.delete(id);
  }

  async getAllContactsPagination(
    user: ActiveUserInterface,
    paginationDto: PaginationDto,
  ): Promise<{
    data: Contact[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit } = paginationDto;

    const [contacts, total] = await this.contactsRepository.findAndCount({
      where: { user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: contacts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getContactsFiltered(
    user: ActiveUserInterface,
    filters: { name?: string; email?: string; phone?: string },
    paginationDto: PaginationDto,
  ): Promise<{
    data: Contact[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page, limit } = paginationDto;

    const queryBuilder = this.contactsRepository.createQueryBuilder('contact');
    queryBuilder.where('contact.userId = :userId', { userId: user.id });

    if (filters.name) {
      queryBuilder.andWhere('contact.name ILIKE :name', {
        name: `%${filters.name}%`, // % para encontrar coincidencias parciales
      });
    }
    if (filters.phone) {
      queryBuilder.andWhere('contact.phone ILIKE :phone', {
        phone: `%${filters.phone}%`,
      });
    }
    if (filters.email) {
      queryBuilder.andWhere('contact.email ILIKE :email', {
        email: `%${filters.email}%`,
      });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [contacts, total] = await queryBuilder.getManyAndCount();

    return {
      data: contacts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
