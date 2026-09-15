import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Workshop } from '../workshops/entities/workshop.entity';

@Injectable()
export class BookingsService {
  constructor(private readonly dataSource: DataSource, @InjectRepository(Booking) private readonly bookings: Repository<Booking>) {}

  async create(userId: number, dto: CreateBookingDto): Promise<Booking> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.getRepository(User).findOne({ where: { id: userId } });
      if (!user) throw new ForbiddenException('Пользователь не найден.');
      // Lock the workshop during the capacity check to prevent overbooking under concurrency.
      const workshop = await manager.getRepository(Workshop).findOne({ where: { id: dto.workshop }, lock: { mode: 'pessimistic_write' } });
      if (!workshop) throw new NotFoundException('Мастер-класс не найден.');
      if (workshop.date <= new Date()) throw new BadRequestException('Нельзя записаться на прошедший мастер-класс.');
      const existing = await manager.getRepository(Booking).findOne({ where: { user: { id: userId }, workshop: { id: workshop.id }, status: BookingStatus.ACTIVE } });
      if (existing) throw new ConflictException('Вы уже записаны на этот мастер-класс.');
      const active = await manager.getRepository(Booking).count({ where: { workshop: { id: workshop.id }, status: BookingStatus.ACTIVE } });
      if (active >= workshop.capacity) throw new ConflictException('На мастер-классе нет свободных мест.');
      return manager.getRepository(Booking).save(manager.getRepository(Booking).create({ user, workshop, status: BookingStatus.ACTIVE }));
    });
  }

  findAll(userId: number, role: UserRole) {
    const where = role === UserRole.ADMIN ? {} : { user: { id: userId } };
    return this.bookings.find({ where, relations: { user: true, workshop: { classroom: true } }, order: { created_at: 'DESC' } });
  }

  async cancel(userId: number, role: UserRole, id: number): Promise<void> {
    const booking = await this.bookings.findOne({ where: { id }, relations: { user: true } });
    if (!booking) throw new NotFoundException('Бронирование не найдено.');
    if (role !== UserRole.ADMIN && booking.user.id !== userId) throw new ForbiddenException('Нельзя отменить чужое бронирование.');
    if (booking.status === BookingStatus.CANCELLED) throw new BadRequestException('Бронирование уже отменено.');
    booking.status = BookingStatus.CANCELLED;
    await this.bookings.save(booking);
  }
}
