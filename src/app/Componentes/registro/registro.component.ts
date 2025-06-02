import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { Router } from '@angular/router';
import { Usuario } from '../../Modelos/usuario';

@Component({
  selector: 'app-registro',
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegistroComponent {
  public registroForm: FormGroup;
  public errorMessage: string = '';
  public submitted: boolean = false;

  constructor(private peticion: UsuariosService, private ruta: Router) {
    this.registroForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]),
      apellidos: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]),
      telefono: new FormControl('', [
        Validators.pattern(/^[0-9]{9}$/)
      ]),
      fecha_nacimiento: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ])
    });
  }

  

  get formControls() {
    return this.registroForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.registroForm.invalid) {
      this.errorMessage = 'Por favor corrige los errores en el formulario';
      return;
    }

    const usuario: Usuario = this.registroForm.value;
    console.log('Formulario enviado:', usuario);

    this.peticion.AnadeUsuario(usuario).subscribe({
      next: (res) => {
        console.log("Usuario añadido:", res);
        this.ruta.navigate(['login']); 
      },
      error: (error) => {
        console.log("Error al añadir usuario:", error);
        this.errorMessage = error.error?.error || 'Error al registrar el usuario. Inténtalo de nuevo.';
      }
    });
  }

  getNombreErrorMessage() {
    if (this.formControls['nombre'].hasError('required')) {
      return 'El nombre es obligatorio';
    }
    if (this.formControls['nombre'].hasError('maxlength')) {
      return 'El nombre no puede exceder los 50 caracteres';
    }
    if (this.formControls['nombre'].hasError('pattern')) {
      return 'El nombre solo puede contener letras y espacios';
    }
    return '';
  }

  getApellidosErrorMessage() {
    if (this.formControls['apellidos'].hasError('required')) {
      return 'Los apellidos son obligatorios';
    }
    if (this.formControls['apellidos'].hasError('maxlength')) {
      return 'Los apellidos no pueden exceder los 100 caracteres';
    }
    if (this.formControls['apellidos'].hasError('pattern')) {
      return 'Los apellidos solo pueden contener letras y espacios';
    }
    return '';
  }

  getEmailErrorMessage() {
    if (this.formControls['email'].hasError('required')) {
      return 'El email es obligatorio';
    }
    if (this.formControls['email'].hasError('email')) {
      return 'Por favor introduce un email válido';
    }
    if (this.formControls['email'].hasError('maxlength')) {
      return 'El email no puede exceder los 100 caracteres';
    }
    return '';
  }

  getTelefonoErrorMessage() {
    if (this.formControls['telefono'].hasError('pattern')) {
      return 'El teléfono debe contener entre 9 y 15 dígitos';
    }
    return '';
  }

  getFechaNacimientoErrorMessage() {
    if (this.formControls['fecha_nacimiento'].hasError('required')) {
      return 'La fecha de nacimiento es obligatoria';
    }
    if (this.formControls['fecha_nacimiento'].hasError('underAge')) {
      return 'Debes tener al menos 13 años para registrarte';
    }
    return '';
  }

  getPasswordErrorMessage() {
    if (this.formControls['password'].hasError('required')) {
      return 'La contraseña es obligatoria';
    }
    if (this.formControls['password'].hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    return '';
  }
}