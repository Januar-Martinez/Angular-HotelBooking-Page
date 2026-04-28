export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export type CreateGuestDto = Omit<Guest, 'id'>;

export type UpdateGuestDto = Partial<CreateGuestDto>;
