import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Classroom } from './classroom.entity';

@Entity('workshops')
export class Workshop {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 200 }) title!: string;
  @Column({ length: 1000 }) descr!: string;
  @Column({ type: 'timestamptz' }) date!: Date;
  @Column({ type: 'smallint' }) capacity!: number;
  @ManyToOne(() => Classroom, (classroom) => classroom.workshops, { onDelete: 'RESTRICT', eager: true })
  @JoinColumn({ name: 'classroom_id' }) classroom!: Classroom;
  @OneToMany(() => Booking, (booking) => booking.workshop) bookings!: Booking[];
  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}
