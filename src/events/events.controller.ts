import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    create(@Body() createEventDto: CreateEventDto) {
        return this.eventsService.create(createEventDto);
    }

    @Get()
    findAll(@Query() query: FindAllEventsDto) {
        return this.eventsService.findAll(query.available);
    }
}
