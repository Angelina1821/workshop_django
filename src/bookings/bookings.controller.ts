import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './bookings.service';
import { UserRole } from '../users/entities/user.entity';

interface AuthRequest { user: { id: number; role: UserRole } }

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly service: BookingsService) {}
  @Post('create') create(@Request() req: AuthRequest, @Body() dto: CreateBookingDto) { return this.service.create(req.user.id, dto); }
  @Get() findAll(@Request() req: AuthRequest) { return this.service.findAll(req.user.id, req.user.role); }
  @Delete(':id') @HttpCode(HttpStatus.NO_CONTENT) cancel(@Request() req: AuthRequest, @Param('id', ParseIntPipe) id: number) { return this.service.cancel(req.user.id, req.user.role, id); }
}
