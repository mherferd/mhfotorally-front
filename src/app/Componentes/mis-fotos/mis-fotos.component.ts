import { Component, OnInit } from '@angular/core';
import { FotosService } from '../../Servicios/fotos.service';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importa ambos

@Component({
  selector: 'app-mis-fotos',
  templateUrl: './mis-fotos.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule], // RouterModule para directivas en template
  styleUrls: ['./mis-fotos.component.css']
})
export class MisFotosComponent implements OnInit {
  fotos: any[] = [];
  cargando = true;
  estados = {
    pendiente: 0,
    admitida: 0,
    rechazada: 0
  };
  currentPage = 1;
  itemsPerPage = 4;

  get fotosPaginadas() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.fotos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.fotos.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  constructor(
    private fotosService: FotosService,
    public authService: UsuariosService,
    private router: Router 
  ) {}

  ngOnInit() {
    this.cargarFotos();
  }

  cargarFotos() {
    if (!this.authService.usuarioLogueado?.id) return;
    
    this.fotosService.listarFotosUsuario(this.authService.usuarioLogueado.id).subscribe({
      next: (fotos) => {
        this.fotos = fotos;
        this.contarEstados();
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });

    console.log('Usuario logueado:', this.authService.usuarioLogueado);
  }

  contarEstados() {
    this.estados = {
      pendiente: this.fotos.filter(f => f.estado === 'pendiente').length,
      admitida: this.fotos.filter(f => f.estado === 'admitida').length,
      rechazada: this.fotos.filter(f => f.estado === 'rechazada').length
    };
  }

  editarFoto(id: number) {
    this.router.navigate(['/mis-fotos/editar', id]); 
  }

  eliminarFoto(id: number) {
    if (confirm('¿Estás seguro de eliminar esta foto?')) {
      this.fotosService.eliminarFoto(id).subscribe({
        next: () => {
          this.fotos = this.fotos.filter(f => f.id !== id);
          this.contarEstados();
        },
        error: (err) => console.error('Error al eliminar foto:', err)
      });
    }
  }
}