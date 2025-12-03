import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

interface EventResponse {
    id: number;
    name: string;
    total_seats: number;
    available_seats?: number;
}

describe('Seat Reservation System (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    let eventId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        prismaService = app.get<PrismaService>(PrismaService);

        // Clean up database
        await prismaService.booking.deleteMany();
        await prismaService.event.deleteMany();
    });

    afterAll(async () => {
        // Clean up database
        await prismaService.booking.deleteMany();
        await prismaService.event.deleteMany();
        await app.close();
    });

    it('/events (POST) - Create Event', async () => {
        const httpServer = app.getHttpServer() as App;
        const response = await request(httpServer)
            .post('/events')
            .send({
                name: 'Test Event',
                totalSeats: 10,
            })
            .expect(201);

        const body = response.body as EventResponse;
        expect(body).toHaveProperty('id');
        expect(body.name).toBe('Test Event');
        expect(body.total_seats).toBe(10);
        eventId = body.id;
    });

    it('/events (GET) - List Events', async () => {
        const httpServer = app.getHttpServer() as App;
        const response = await request(httpServer).get('/events').expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        const events = response.body as EventResponse[];
        const event = events.find((e) => e.id === eventId);
        expect(event).toBeDefined();
        if (event) {
            expect(event.available_seats).toBe(10);
        }
    });

    it('/bookings (POST) - Reserve Seat', async () => {
        const httpServer = app.getHttpServer() as App;
        await request(httpServer)
            .post('/bookings/reserve')
            .send({
                eventId: eventId,
                userId: 'user1',
            })
            .expect(201);
    });

    it('/bookings (POST) - Reserve Same Seat (Fail)', async () => {
        const httpServer = app.getHttpServer() as App;
        await request(httpServer)
            .post('/bookings/reserve')
            .send({
                eventId: eventId,
                userId: 'user1',
            })
            .expect(409);
    });
    it('/events (GET) - List Events (Check Availability)', async () => {
        const httpServer = app.getHttpServer() as App;
        const response = await request(httpServer).get('/events').expect(200);

        const events = response.body as EventResponse[];
        const event = events.find((e) => e.id === eventId);
        if (event) {
            expect(event.available_seats).toBe(9);
        }
    });

    it('/bookings/cancel (POST) - Cancel Reservation', async () => {
        const httpServer = app.getHttpServer() as App;
        await request(httpServer)
            .post('/bookings/cancel')
            .send({
                eventId: eventId,
                userId: 'user1',
            })
            .expect(201);
    });
    it('/events (GET) - List Events (Check Availability Restored)', async () => {
        const httpServer = app.getHttpServer() as App;
        const response = await request(httpServer).get('/events').expect(200);

        const events = response.body as EventResponse[];
        const event = events.find((e) => e.id === eventId);
        if (event) {
            expect(event.available_seats).toBe(10);
        }
    });
});
