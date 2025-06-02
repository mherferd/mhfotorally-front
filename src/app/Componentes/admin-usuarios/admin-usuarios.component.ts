import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../Modelos/usuario';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class AdminUsuariosComponent implements OnInit {
  
  usuarios: Usuario[] = [];
  cargando = true;
  busqueda = '';
  currentPage = 1;
  itemsPerPage = 10;


  constructor(private usuariosService: UsuariosService) {
    console.log('[AdminUsuariosComponent] Constructor iniciado');
  }

  ngOnInit() {
    console.log('[AdminUsuariosComponent] ngOnInit iniciado');
    this.cargarUsuarios();
  }

  get usuariosPaginados() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.usuariosFiltrados.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.usuariosFiltrados.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  cargarUsuarios() {
    console.log('[AdminUsuariosComponent] Cargando lista de usuarios...');
    this.cargando = true;
    
    this.usuariosService.ListarUsuarios().subscribe({
      next: (usuarios) => {
        console.log('[AdminUsuariosComponent] Usuarios recibidos:', usuarios);
        this.usuarios = usuarios;
        this.cargando = false;
      },
      error: (err) => {
        console.error('[AdminUsuariosComponent] Error al cargar usuarios:', err);
        this.cargando = false;
      }
    });
  }

  eliminarUsuario(id: number) {
    console.log('[AdminUsuariosComponent] Intentando eliminar usuario ID:', id);
    
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuariosService.EliminarUsuario(id).subscribe({
        next: () => {
          console.log('[AdminUsuariosComponent] Usuario eliminado, actualizando lista...');
          this.usuarios = this.usuarios.filter(u => u.id !== id);
        },
        error: (err) => {
          console.error('[AdminUsuariosComponent] Error al eliminar usuario:', err);
        }
      });
    }
  }

  get usuariosFiltrados() {
    if (!this.busqueda) return this.usuarios;
    
    return this.usuarios.filter(usuario => 
      usuario.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      usuario.apellidos.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }
}