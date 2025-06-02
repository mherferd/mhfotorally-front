import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { FotosService } from '../../Servicios/fotos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subir-foto',
  imports: [FormsModule, CommonModule],
  templateUrl: './subir-foto.component.html',
  styleUrls: ['./subir-foto.component.css']
})
export class SubirFotoComponent {
  archivo: File | null = null;
  imagenPrevia: string | ArrayBuffer | null = null;
  fotoData = {
    titulo: '',
    descripcion: ''
  };
  mensaje = '';
  cargando = false;

  constructor(
    private fotosService: FotosService,
    private usuariosService: UsuariosService
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const tiposPermitidos = ['image/jpeg', 'image/png'];
      const tamanoMaximo = 5 * 1024 * 1024; 

      if (!tiposPermitidos.includes(file.type)) {
        this.mensaje = 'Solo se permiten imágenes JPEG o PNG';
        return;
      }

      if (file.size > tamanoMaximo) {
        this.mensaje = 'La imagen no puede superar los 5MB';
        return;
      }

      this.archivo = file;
      this.mensaje = '';

      const reader = new FileReader();
      reader.onload = (e) => this.imagenPrevia = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.archivo || !this.fotoData.titulo) {
      this.mensaje = 'Por favor, completa todos los campos requeridos';
      return;
    }

    this.cargando = true;
    const usuarioId = this.usuariosService.usuarioLogueado?.id;
    
    if (!usuarioId) {
      this.mensaje = 'No se pudo identificar al usuario';
      this.cargando = false;
      return;
    }

    const datosFoto = {
      ...this.fotoData,
      usuario_id: usuarioId
    };

    this.fotosService.subirFoto(this.archivo, datosFoto).subscribe({
      next: (respuesta) => {
        console.log('Respuesta del servidor:', respuesta);
        this.mensaje = 'Foto subida correctamente. Espera la validación del administrador.';
        this.resetForm();
      },
      error: (error) => {
        console.error('Error completo:', error);
        if (error.error) {
          this.mensaje = error.error.error || 'Error al subir la foto. Inténtalo de nuevo.';
        } else {
          this.mensaje = 'Error de conexión con el servidor';
        }
        this.cargando = false;
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }

  resetForm(): void {
    this.archivo = null;
    this.imagenPrevia = null;
    this.fotoData = { titulo: '', descripcion: '' };
    const inputFile = document.getElementById('fileInput') as HTMLInputElement;
    if (inputFile) inputFile.value = '';
  }
}