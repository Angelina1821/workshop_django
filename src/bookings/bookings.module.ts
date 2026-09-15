import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { User } from '../users/entities/user.entity';
import { Workshop } from '../workshops/entities/workshop.entity';

@Module({ imports: [TypeOrmModule.forFeature([Booking, User, Workshop])], controllers: [BookingsController], providers: [BookingsService] })
export class BookingsModule {}
