import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { Classroom } from './entities/classroom.entity';
import { Workshop } from './entities/workshop.entity';

@Injectable()
export class WorkshopsService {
  constructor(@InjectRepository(Workshop) private readonly workshops: Repository<Workshop>, @InjectRepository(Classroom) private readonly classrooms: Repository<Classroom>) {}
  findAll() { return this.workshops.find({ order: { date: 'ASC' } }); }
  async findOne(id: number) { const item = await this.workshops.findOne({ where: { id } }); if (!item) throw new NotFoundException('Мастер-класс не найден.'); return item; }
  async create(dto: CreateWorkshopDto) { const classroom = await this.findClassroom(dto.classroom); return this.workshops.save(this.workshops.create({ title: dto.title, descr: dto.descr, date: new Date(dto.date), capacity: dto.capacity, classroom })); }
  async update(id: number, dto: UpdateWorkshopDto) { const item = await this.findOne(id); if (dto.classroom !== undefined) item.classroom = await this.findClassroom(dto.classroom); if (dto.title !== undefined) item.title = dto.title; if (dto.descr !== undefined) item.descr = dto.descr; if (dto.date !== undefined) item.date = new Date(dto.date); if (dto.capacity !== undefined) item.capacity = dto.capacity; return this.workshops.save(item); }
  async remove(id: number) { await this.workshops.remove(await this.findOne(id)); }
  createClassroom(dto: CreateClassroomDto) { return this.classrooms.save(this.classrooms.create(dto)); }
  findClassrooms() { return this.classrooms.find({ order: { id: 'ASC' } }); }
  private async findClassroom(id: number) { const item = await this.classrooms.findOne({ where: { id } }); if (!item) throw new NotFoundException('Аудитория не найдена.'); return item; }
}
