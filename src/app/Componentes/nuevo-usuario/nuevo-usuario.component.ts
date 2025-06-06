import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from '../../Servicios/usuarios.service'; 
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent {
  usuarioForm: FormGroup;
  cargando = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      apellidos: ['', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      telefono: ['', [
        Validators.pattern(/^[0-9]{9}$/)
      ]],
      fecha_nacimiento: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      rol: ['participante', Validators.required]
    });
  }

  onSubmit() {
    if (this.usuarioForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.cargando = true;
    this.errorMessage = '';

    this.usuariosService.AnadeUsuario(this.usuarioForm.value).subscribe({
      next: (usuario) => {
        console.log('Usuario creado:', usuario);
        this.router.navigate(['/admin/usuarios']);
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        this.errorMessage = error.error?.error || 'Error al crear el usuario';
        this.cargando = false;
      },
      complete: () => {
        this.cargando = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }
   getFieldError(field: string): string {
    const control = this.usuarioForm.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (control.errors['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors['pattern']) {
        if (field === 'nombre' || field === 'apellidos') {
          return 'Solo se permiten letras y espacios';
        }
        if (field === 'telefono') {
          return 'Debe contener 9 dígitos';
        }
      }
      if (control.errors['email']) {
        return 'Email no válido';
      }
      if (control.errors['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

}