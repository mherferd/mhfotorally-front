import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { Router } from '@angular/router';
import { FotosService } from '../../Servicios/fotos.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any;
  stats = {
    fotosEnviadas: 0,
    fotosAprobadas: 0,
    fotosPendientes: 0,
    fotosRechazadas: 0,
    totalLikes: 0,
    totalDislikes: 0,
    ratioAprobacion: '0%'
  };
  
  logros = [
    { nombre: 'Primera Foto', color: '#FFD700' },
    { nombre: 'Top 10', color: '#C0C0C0' },
    { nombre: 'Fotógrafo Activo', color: '#CD7F32' }
  ];

  constructor(
    public auth: UsuariosService, 
    private router: Router,
    private fotosService: FotosService
  ) {}

  ngOnInit(): void {
    if (this.auth.usuarioLogueado) {
      this.usuario = {...this.auth.usuarioLogueado};
      this.cargarEstadisticas();
    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarEstadisticas() {
    const usuarioId = this.auth.usuarioLogueado?.id;
    
    if (!usuarioId) {
      console.error('ID de usuario no disponible');
      return;
    }

    this.fotosService.listarFotosUsuario(usuarioId).subscribe({
      next: (fotos) => {
        this.stats.fotosEnviadas = fotos.length;
        this.stats.fotosAprobadas = fotos.filter(f => f.estado === 'admitida').length;
        this.stats.fotosPendientes = fotos.filter(f => f.estado === 'pendiente').length;
        this.stats.fotosRechazadas = fotos.filter(f => f.estado === 'rechazada').length;
      },
      error: (err) => console.error('Error cargando estadísticas:', err)
    });
  }

}