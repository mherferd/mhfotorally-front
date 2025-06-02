import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { FotosService } from '../../Servicios/fotos.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-fotos',
  imports: [CommonModule],
  templateUrl: './admin-fotos.component.html',
  styleUrls: ['./admin-fotos.component.css']
})
export class AdminFotosComponent implements OnInit {
  fotosPendientes: any[] = [];
  cargando = true;
  error = '';
  mensajeExito = '';

  constructor(
    private fotosService: FotosService,
    public usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    if (!this.usuariosService.estaLogueado() || !this.usuariosService.esAdmin()) {
      this.error = 'Acceso no autorizado';
      return;
    }

    this.cargarFotosPendientes();
  }

  cargarFotosPendientes(): void {
    this.cargando = true;
    this.error = '';

    this.fotosService.listarFotos('pendiente').subscribe({
      next: (fotos: any) => {
        console.log('Datos recibidos del servidor:', fotos); 

        this.fotosPendientes = fotos;

        if (this.fotosPendientes.length === 0) {
          this.error = 'No hay fotos pendientes de revisión';
        }

        this.fotosPendientes.forEach((foto: any) => {
          console.log('Foto:', foto.id, 'Usuario:', foto.usuario); 
        });

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error completo:', err); 
        this.error = 'Error al cargar las fotos pendientes';
        this.cargando = false;
      }
    });

  }

  aprobarFoto(fotoId: number): void {
    this.actualizarEstadoFoto(fotoId, 'admitida');
  }

  rechazarFoto(fotoId: number, motivo: string): void {
    this.actualizarEstadoFoto(fotoId, 'rechazada', motivo);
  }

  actualizarEstadoFoto(fotoId: number, estado: string, motivo?: string): void {
    this.cargando = true;

    const fotoOriginal = this.fotosPendientes.find(f => f.id === fotoId);

    const datosActualizacion: any = {
      id: fotoId,
      estado: estado,
      titulo: fotoOriginal.titulo,
      descripcion: fotoOriginal.descripcion,
      motivo_rechazo: motivo || null
    };

    this.fotosService.actualizarFoto(datosActualizacion).subscribe({
      next: (respuesta: any) => {
        this.fotosPendientes = this.fotosPendientes.filter(f => f.id !== fotoId);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al actualizar foto:', err);
        this.cargando = false;
      }
    });
  }
}