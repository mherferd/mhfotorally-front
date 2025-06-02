import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  fotosPendientes: number = 0;
  totalUsuarios: number = 0;
  totalFotos: number = 0;
  topParticipante: string = '';

  constructor(
    public authService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.estaLogueado() || !this.authService.esAdmin()) {
      this.router.navigate(['/login']);
    }
  }


}