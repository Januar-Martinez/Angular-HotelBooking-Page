export interface Room {
  id: string;
  number: string;
  type: string;
  price: string;
  is_available: boolean;
}

export type CreateRoomDto = Omit<Room, 'id'>;

export type UpdateRoomDto = Partial<CreateRoomDto>;