// header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(public auth: UsuariosService) {}

  getNombreUsuario(): string {
    return this.auth.usuarioLogueado?.nombre || 'Usuario';
  }
}