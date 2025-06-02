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
    console.log('[EditarUsuarioComponent] Constructor iniciado');
    this.usuarioForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      fecha_nacimiento: [''],
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
}