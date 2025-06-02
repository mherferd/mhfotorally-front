import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-participante',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './participante.component.html',
  styleUrls: ['./participante.component.css']
})
export class ParticipanteComponent implements OnInit {

  fotosAprobadas: number = 0;
  fotosPendientes: number = 0;
  desafiosActivos: any[] = []; 

  constructor(
    public authService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.estaLogueado() || this.authService.esAdmin()) {
      this.router.navigate(['/login']);
    } else {
      this.cargarDatosParticipante();
    }
  }

  cargarDatosParticipante() {

    this.fotosAprobadas = 3;
    this.fotosPendientes = 2;
    this.desafiosActivos = [
      {
        tema: 'Naturaleza',
        titulo: 'Flora Local',
        descripcion: 'Captura la esencia de la vegetación autóctona',
        imagen: '/assets/imagenes/desafio-naturaleza.jpg',
        fechaFin: 'Hasta el 30/06',
        premio: 'Cámara profesional'
      },
    ];
    
  }
}