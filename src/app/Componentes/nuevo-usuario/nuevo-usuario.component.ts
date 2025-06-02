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
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      fecha_nacimiento: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
}