import { Contact } from '../../contacts/entities/contact.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  photo?: string;

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];
}
