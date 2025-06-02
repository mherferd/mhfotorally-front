// componentes/galeria/galeria.component.ts
import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { FotosService } from '../../Servicios/fotos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-galeria',
  imports: [CommonModule, FormsModule],
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {

  fotos: any[] = [];
  cargando = true;
  error = '';
  filtroEstado = 'admitida';
  filtroCategoria = '';
  selectedImage: string | null = null;
  currentPage = 1;
  itemsPerPage = 12;


  constructor(
    private fotosService: FotosService,
    public usuariosService: UsuariosService
  ) { }

  get fotosPaginadas() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.getFotosFiltradas().slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.getFotosFiltradas().length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  ngOnInit(): void {
    this.cargarFotos();
  }

  cargarFotos(): void {
    this.cargando = true;
    this.error = '';

    this.fotosService.listarFotos('admitida').subscribe({
      next: (fotos) => {
        this.fotos = fotos;
        this.cargando = false;

        if (fotos.length === 0) {
          this.error = 'No hay fotos disponibles en la galería';
        }
      },
      error: (err) => {
        console.error('Error al cargar fotos:', err);
        this.error = 'Error al cargar las fotos. Inténtalo de nuevo más tarde.';
        this.cargando = false;
        this.fotos = [];
      }
    });
  }

  contarVotos(foto: any, tipo: number): number {
    if (!foto.votos) return 0;
    return foto.votos.filter((v: any) => v.valoracion === tipo).length;
  }

  yaVoto(foto: any): boolean {
    if (!this.usuariosService.estaLogueado()) return true;
    return foto.votos?.some((v: any) => v.usuario_id === this.usuariosService.usuarioLogueado?.id);
  }

  esMiVoto(foto: any, tipo: number): boolean {
    return foto.miVoto === tipo;
  }

  votarFoto(fotoId: number, valoracion: number): void {
    if (!this.usuariosService.estaLogueado()) {
      this.error = 'Debes iniciar sesión para votar';
      return;
    }

    const fotoIndex = this.fotos.findIndex(f => f.id === fotoId);
    if (fotoIndex === -1) return;

    const foto = this.fotos[fotoIndex];

    if (foto.miVoto === valoracion) {
      return;
    }

    foto.cargandoVoto = true;
    this.error = '';

    this.fotosService.votarFoto(fotoId, valoracion).subscribe({
      next: (respuesta: any) => {

        foto.likes = respuesta.likes;
        foto.dislikes = respuesta.dislikes;
        foto.miVoto = respuesta.mi_voto;

        this.fotos = [...this.fotos];
      },
      error: (err) => {
        console.error('Error al votar:', err);
        this.error = typeof err === 'string' ? err : 'Error al registrar el voto';
      },
      complete: () => {
        foto.cargandoVoto = false;
      }
    });
  }
  getFotosFiltradas(): any[] {
    return this.fotos.filter(foto => {
      const estadoOk = this.filtroEstado ? foto.estado === this.filtroEstado : true;
      const categoriaOk = this.filtroCategoria ? foto.categoria === this.filtroCategoria : true;
      return estadoOk && categoriaOk;
    });
  }

  estaDeshabilitado(foto: any): boolean {
    if (!this.usuariosService.estaLogueado()) {
      return true;
    }
    return foto.votos?.some((v: any) => v.usuario_id === this.usuariosService.usuarioLogueado?.id);
  }

  openModal(imageUrl: string) {
    this.selectedImage = imageUrl;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedImage = null;
    document.body.style.overflow = 'auto';
  }
}