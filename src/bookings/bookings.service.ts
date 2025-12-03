import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) {}

    async reserve(eventId: number, userId: string) {
        // Check if event exists
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        // Check for available seats
        const bookingsCount = await this.prisma.booking.count({
            where: { event_id: eventId },
        });

        if (bookingsCount >= event.total_seats) {
            throw new UnprocessableEntityException('No seats available');
        }

        // Create booking
        try {
            const booking = await this.prisma.booking.create({
                data: {
                    event_id: eventId,
                    user_id: userId,
                },
            });
            return booking;
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException(
                    'User already booked for this event',
                );
            }
            throw error;
        }
    }

    async cancel(eventId: number, userId: string) {
        try {
            return await this.prisma.booking.delete({
                where: {
                    event_id_user_id: {
                        event_id: eventId,
                        user_id: userId,
                    },
                },
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException('Booking not found');
            }
            throw error;
        }
    }
}
