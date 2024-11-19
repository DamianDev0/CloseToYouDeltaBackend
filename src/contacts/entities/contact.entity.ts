import { Roles } from '../../common/enum/roles.enum';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
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
  latitude: string | number;

  @Column('float', { nullable: true })
  longitude: string | number;

  @ManyToOne(() => User, (user) => user.contacts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
