import { Roles } from 'src/common/enum/roles.enum';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  recordID: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({
    type: 'enum',
    enum: Roles,
    nullable: true,
    default: Roles.CUSTOMER,
  })
  role?: Roles;

  @Column('float', { nullable: true })
  latitude: number;

  @Column('float', { nullable: true })
  longitude: number;

  @ManyToOne(() => User, (user) => user.contacts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
