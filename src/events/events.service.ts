import { ConflictException, Injectable } from '@nestjs/common';
import { Event, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) {}

    async create(createEventDto: CreateEventDto) {
        try {
            return await this.prisma.event.create({
                data: {
                    name: createEventDto.name,
                    total_seats: createEventDto.totalSeats,
                },
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw new ConflictException(
                    'Event with this name already exists',
                );
            }
            throw error;
        }
    }

    async findAll(available = false) {
        let events: (Event & { bookings_count: number })[];

        // Raw SQL Optimizations:
        // Using raw SQL for efficient aggregation of available seats.

        if (available) {
            events = await this.prisma.$queryRaw<
                (Event & { bookings_count: number })[]
            >`
        SELECT 
          e.*, 
          CAST(COUNT(b.id) AS INTEGER) AS bookings_count
        FROM events e
        LEFT JOIN bookings b ON e.id = b.event_id
        GROUP BY e.id
        HAVING COUNT(b.id) < e.total_seats
        ORDER BY e.id ASC
      `;
        } else {
            events = await this.prisma.$queryRaw<
                (Event & { bookings_count: number })[]
            >`
      SELECT 
        e.*, 
        CAST(COUNT(b.id) AS INTEGER) AS bookings_count
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      GROUP BY e.id
      ORDER BY e.id ASC
    `;
        }

        return events.map((event) => ({
            ...event,
            available_seats: event.total_seats - event.bookings_count,
        }));
    }
}
