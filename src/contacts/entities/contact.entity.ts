import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  role?: string;

  @Column({ nullable: true, type: 'json' })
  location: {
    latitude: number;
    longitude: number;
  };
}
