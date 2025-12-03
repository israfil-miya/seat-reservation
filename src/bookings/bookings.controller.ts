import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { ReserveBookingDto } from './dto/reserve-booking.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Post('reserve')
    reserve(@Body() reserveBookingDto: ReserveBookingDto) {
        return this.bookingsService.reserve(
            reserveBookingDto.eventId,
            reserveBookingDto.userId,
        );
    }

    @Post('cancel')
    cancel(@Body() cancelBookingDto: CancelBookingDto) {
        return this.bookingsService.cancel(
            cancelBookingDto.eventId,
            cancelBookingDto.userId,
        );
    }
}
