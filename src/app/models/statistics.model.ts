export interface RoomOccupancy {
  room_id: number;
  room_number: string;
  total_reservations: number;
  total_nights: number;
  total_revenue: number;
}

export interface Statistics {
  total_revenue: number;
  total_reservations: number;
  occupancy_by_room: RoomOccupancy[];
  most_booked_room: string;
}