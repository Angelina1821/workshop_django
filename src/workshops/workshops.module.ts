import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkshopsController } from './workshops.controller';
import { WorkshopsService } from './workshops.service';
import { Classroom } from './entities/classroom.entity';
import { Workshop } from './entities/workshop.entity';

@Module({ imports: [TypeOrmModule.forFeature([Workshop, Classroom])], controllers: [WorkshopsController], providers: [WorkshopsService] })
export class WorkshopsModule {}
