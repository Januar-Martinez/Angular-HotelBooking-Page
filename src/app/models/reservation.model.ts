export interface Reservation {
  id: number;
  guest_id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  total_price: number;
  guest_name?: string;
  room_number?: string;
}

export type CreateReservationDto = Omit<Reservation, 'id' | 'guest_name' | 'room_number'>;
export type UpdateReservationDto = Partial<CreateReservationDto>;