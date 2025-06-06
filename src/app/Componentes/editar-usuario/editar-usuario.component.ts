import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditarUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  cargando = false;
  idUsuario: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService
  ) {
    this.usuarioForm = this.fb.group({
      id: [''],
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
      rol: ['participante', Validators.required]
    });
  }

  ngOnInit() {
    console.log('[EditarUsuarioComponent] ngOnInit iniciado');
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.idUsuario = +id;
      console.log('[EditarUsuarioComponent] ID de usuario a editar:', this.idUsuario);
      this.cargarUsuario();
    } else {
      console.warn('[EditarUsuarioComponent] No se proporcionó ID de usuario');
      this.router.navigate(['/admin/usuarios']);
    }
  }

  cargarUsuario() {
    console.log('[EditarUsuarioComponent] Cargando usuario...');
    this.cargando = true;
    
    this.usuariosService.ObtenerUsuarioPorId(this.idUsuario).subscribe({
      next: (usuario) => {
        console.log('[EditarUsuarioComponent] Usuario cargado:', usuario);
        
        if (usuario.fecha_nacimiento) {
          const fecha = new Date(usuario.fecha_nacimiento);
          usuario.fecha_nacimiento = fecha.toISOString().split('T')[0];
        }
        
        this.usuarioForm.patchValue(usuario);
        this.cargando = false;
      },
      error: (err) => {
        console.error('[EditarUsuarioComponent] Error al cargar usuario:', err);
        this.cargando = false;
        this.router.navigate(['/admin/usuarios']);
      }
    });
  }

  guardarCambios() {
    console.log('[EditarUsuarioComponent] Intentando guardar cambios...');
    
    if (this.usuarioForm.invalid) {
      console.warn('[EditarUsuarioComponent] Formulario inválido:', this.usuarioForm.errors);
      return;
    }

    this.cargando = true;
    const usuario = this.usuarioForm.value;
    console.log('[EditarUsuarioComponent] Datos a guardar:', usuario);

    this.usuariosService.ActualizarUsuario(usuario).subscribe({
      next: () => {
        console.log('[EditarUsuarioComponent] Usuario actualizado con éxito');
        this.router.navigate(['/admin/usuarios']);
      },
      error: (err) => {
        console.error('[EditarUsuarioComponent] Error al actualizar usuario:', err);
        this.cargando = false;
      }
    });
  }

  cancelar() {
    console.log('[EditarUsuarioComponent] Cancelando edición...');
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
    }
    return '';
  }
}