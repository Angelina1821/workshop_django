import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workshop } from './workshop.entity';

@Entity('classrooms')
export class Classroom {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 100 }) name!: string;
  @Column({ length: 300 }) address!: string;
  @OneToMany(() => Workshop, (workshop) => workshop.classroom) workshops!: Workshop[];
}
