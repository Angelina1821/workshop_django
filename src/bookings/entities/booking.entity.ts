import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Workshop } from '../../workshops/entities/workshop.entity';

export enum BookingStatus { ACTIVE = 'ACTIVE', CANCELLED = 'CANCELLED' }

@Entity('bookings')
@Index(['user', 'workshop'], { unique: true, where: '"status" = \'ACTIVE\'' })
export class Booking {
  @PrimaryGeneratedColumn() id!: number;
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'user_id' }) user!: User;
  @ManyToOne(() => Workshop, (workshop) => workshop.bookings, { onDelete: 'CASCADE', eager: true }) @JoinColumn({ name: 'workshop_id' }) workshop!: Workshop;
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.ACTIVE }) status!: BookingStatus;
  @CreateDateColumn() created_at!: Date;
}
