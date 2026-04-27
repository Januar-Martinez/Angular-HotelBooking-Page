import { MenuItem } from '../models/menu.model';

export const MENU_CONFIG: MenuItem[] = [
  {
    type: 'normal',
    label: 'Inicio',
    link: '/',
  },
  {
    type: 'normal',
    label: 'Huéspedes',
    link: '/guests',
  },
  {
    type: 'normal',
    label: 'Habitaciones',
    link: '/rooms',
  },
  {
    type: 'normal',
    label: 'Reservas',
    link: '/reservations',
  },
];
