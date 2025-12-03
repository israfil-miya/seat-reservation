# Seat Reservation System

A robust REST API for managing event seat reservations, built with NestJS, Prisma, and PostgreSQL.

## Features

- **Event Management**: Create and list events.
- **Seat Reservation**: Reserve seats for specific events with concurrency handling.
- **Cancellation**: Cancel existing reservations.
- **Real-time Availability**: View available seat counts for events.
- **Concurrency Safety**: Prevents double-booking using database constraints and transactions.

## Technologies

- [NestJS](https://nestjs.com/) - A progressive Node.js framework.
- [Prisma](https://www.prisma.io/) - Next-generation ORM.
- [PostgreSQL](https://www.postgresql.org/) - Relational database.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
- [Jest](https://jestjs.io/) - Testing framework.

## Prerequisites

- Node.js (v16 or later)
- pnpm (or npm/yarn)
- PostgreSQL database

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/israfil-miya/seat-reservation.git
    cd seat-reservation
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add your database connection string:

    ```env
    DATABASE_URL="postgresql://example_user:example_password@aws-host.example.com:6543/seat_reservation?pgbouncer=true"
    ```

4. Run database migrations:
    ```bash
    pnpm prisma migrate dev
    ```

## Running the Application

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

## API Endpoints

### Events

- **POST /api/events**
    - Create a new event.
    - Body: `{ "name": "Concert", "totalSeats": 100 }`

- **GET /api/events**
    - List all events with their available seat count.
    - Query Params: `?available=true` (optional) to filter only events with available seats.

### Bookings

- **POST /api/bookings/reserve**
    - Reserve a seat for an event.
    - Body: `{ "eventId": 1, "userId": "user-123" }`

- **POST /api/bookings/cancel**
    - Cancel a reservation.
    - Body: `{ "eventId": 1, "userId": "user-123" }`

## Testing

Run the end-to-end tests to verify the application flows:

```bash
pnpm test:e2e
```

## Project Structure

- `src/events`: Event management logic (Service, Controller, DTOs).
- `src/bookings`: Booking management logic (Service, Controller, DTOs).
- `src/prisma`: Prisma service and database connection.
- `test`: End-to-end tests.
