import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ActiveUserInterface } from '../common/interface/activeUserInterface';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
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
  ): Promise<Contact> {
    const contact = this.contactsRepository.create({
      ...createContactDto,
      user: { id: user.id },
    });
    return this.contactsRepository.save(contact);
  }

  async createMultipleContacts(
    contacts: CreateContactDto[],
    user: ActiveUserInterface,
  ): Promise<Contact[]> {
    const createdContacts = await Promise.all(
      contacts.map((contactDto) => this.createContact(contactDto, user)),
    );
    return createdContacts;
  }

  async updateContact(
    id: string,
    updateContactDto: UpdateContactDto,
    user: ActiveUserInterface,
  ): Promise<Contact> {
    const contact = await this.getContactById(id, user);
    return this.contactsRepository.save({ ...contact, ...updateContactDto });
  }

  async deleteContact(id: string, user: ActiveUserInterface): Promise<void> {
    await this.getContactById(id, user);
    await this.contactsRepository.delete(id);
  }
}
