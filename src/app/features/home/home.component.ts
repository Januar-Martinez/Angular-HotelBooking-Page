// src/app/features/home/home.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface QuickAccessCard {
  label: string;
  link: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  quickAccess: QuickAccessCard[] = [
    {
      label: 'Huéspedes',
      link: '/guests',
      icon: 'fa-solid fa-users',
      description: 'Gestiona el registro y perfil de huéspedes del hotel.'
    },
    {
      label: 'Habitaciones',
      link: '/rooms',
      icon: 'fa-solid fa-door-open',
      description: 'Consulta disponibilidad y estado de cada habitación.'
    },
    {
      label: 'Reservas',
      link: '/reservations',
      icon: 'fa-solid fa-calendar-check',
      description: 'Crea, consulta y administra las reservas activas.'
    }
  ];
}