import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CancelBookingDto {
    @IsInt()
    @IsNotEmpty()
    eventId: number;

    @IsString()
    @IsNotEmpty()
    userId: string;
}
