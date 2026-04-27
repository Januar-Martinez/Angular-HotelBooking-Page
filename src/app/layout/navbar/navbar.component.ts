import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MENU_CONFIG } from '../../data/menu.config';
import { MenuItem } from '../../models/menu.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MenuItemComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  menuItems: MenuItem[] = MENU_CONFIG;
}