import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FotosService } from '../../Servicios/fotos.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-foto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-foto.component.html',
  styleUrls: ['./editar-foto.component.css']
})
export class EditarFotoComponent implements OnInit {

  fotoForm: FormGroup;
  cargando = true;
  idFoto: number = 0;
  fotoOriginal: any;
  imagenPrevia: string | ArrayBuffer | null = null;
  archivo: File | null = null;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private fotosService: FotosService
  ) {
    this.fotoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]],
      archivo: [null]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && !isNaN(+id)) {
        this.idFoto = +id;
        this.cargarFoto();
      } else {
        this.router.navigate(['/mis-fotos']);
      }
    });
  }

  cargarFoto() {
    this.cargando = true;
    this.mensajeError = '';
    
    this.fotosService.ObtenerFoto({ id: this.idFoto }).subscribe({
      next: (foto) => {
        console.log('Foto cargada:', foto);
        this.fotoOriginal = foto;
        
        this.fotoForm.patchValue({
          titulo: foto.titulo || '',
          descripcion: foto.descripcion || ''
        });
        
        if (foto.url) {
          if (foto.url.startsWith('http')) {
            this.imagenPrevia = foto.url;
          } else {
            this.imagenPrevia = `http://15.236.209.101/imagenes/${foto.url}`;
          }
        }
        
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar foto:', err);
        this.mensajeError = 'Error al cargar la foto';
        this.router.navigate(['/mis-fotos']);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.mensajeError = '';
    
    if (file) {

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.mensajeError = 'Tipo de archivo no válido. Solo se permiten: JPG, PNG, GIF';
        event.target.value = '';
        return;
      }

      const maxSize = 5 * 1024 * 1024; 
      if (file.size > maxSize) {
        this.mensajeError = 'El archivo es demasiado grande. Máximo 5MB';
        event.target.value = '';
        return;
      }

      this.archivo = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPrevia = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.fotoForm.invalid) {
      this.mensajeError = 'Por favor, completa todos los campos ';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const titulo = this.fotoForm.value.titulo;
    const descripcion = this.fotoForm.value.descripcion || '';

    if (this.archivo) {
      console.log('Actualizando foto con nueva imagen');
      this.fotosService.actualizarFotoConImagen(this.idFoto, this.archivo, titulo, descripcion).subscribe({
        next: (respuesta) => {
          console.log('Foto actualizada con imagen:', respuesta);
          if (respuesta.success) {
            this.router.navigate(['/mis-fotos']);
          } else {
            this.mensajeError = respuesta.error || 'Error al actualizar la foto';
            this.cargando = false;
          }
        },
        error: (err) => {
          console.error('Error al actualizar con imagen:', err);
          this.mensajeError = err.error?.error || 'Error al actualizar la foto';
          this.cargando = false;
        }
      });
    } else {
      console.log('Actualizando solo título y descripción');
      const datosActualizados = {
        id: this.idFoto,
        titulo: titulo,
        descripcion: descripcion,
        estado: 'pendiente'
      };

      this.fotosService.actualizarFoto(datosActualizados).subscribe({
        next: (respuesta) => {
          console.log('Foto actualizada sin imagen:', respuesta);
          if (respuesta.success) {
            this.router.navigate(['/mis-fotos']);
          } else {
            this.mensajeError = respuesta.error || 'Error al actualizar la foto';
            this.cargando = false;
          }
        },
        error: (err) => {
          console.error('Error al actualizar sin imagen:', err);
          this.mensajeError = err.error?.error || 'Error al actualizar la foto';
          this.cargando = false;
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.fotoForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName} no puede tener más de ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}