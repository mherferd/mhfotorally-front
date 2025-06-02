import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Usuario } from '../Modelos/usuario';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url = 'http://15.236.209.101/servicios.php';
  public usuarioLogueado: Usuario | null = null;


  constructor(private http: HttpClient, private router: Router) {
    this.cargarUsuarioGuardado();
  }


  AnadeUsuario(usuario: Usuario) {

    if (!usuario.nombre || !usuario.apellidos || !usuario.email || !usuario.fecha_nacimiento || !usuario.password) {
      return throwError(() => 'Todos los campos obligatorios deben estar completos');
    }

    let pa = JSON.stringify({
      accion: "CrearUsuario",
      usuario: usuario
    });

    return this.http.post<Usuario[]>(this.url, pa)
  }


  ObtieneUsuarios(credenciales: any) {
    let pa = JSON.stringify({
      accion: "ObtenerUsuario",
      credenciales: credenciales
    });

    console.log(pa);

    return this.http.post<Usuario[]>(this.url, pa)
  }



  private cargarUsuarioGuardado() {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioLogueado = JSON.parse(usuarioGuardado) as Usuario;
    }
  }

  login(email: string, password: string) {
    this.http.post<Usuario>(this.url, { accion: "Login", credenciales: { email, password } }).subscribe({
      next: (usuario) => {
        this.usuarioLogueado = usuario;
        localStorage.setItem('usuario', JSON.stringify(usuario));

        if (usuario.rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/estadios-futbol']);
        }
      }
    });
  }

  logout() {
    this.usuarioLogueado = null;
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  estaLogueado(): boolean {
    return this.usuarioLogueado !== null;
  }

  esAdmin(): boolean {
    return this.usuarioLogueado?.rol === 'admin';
  }

  ListarUsuarios() {
    const pa = JSON.stringify({ accion: "ListarUsuarios" });
    return this.http.post<Usuario[]>(this.url, pa);
  }

  ObtenerUsuarioPorId(id: number) {
    console.log('[UsuariosService] Obteniendo usuario con ID:', id);
    const pa = JSON.stringify({
      accion: "ObtenerUsuario",
      credenciales: { id }
    });

    return this.http.post<Usuario>(this.url, pa).pipe(
      tap(usuario => console.log('[UsuariosService] Usuario recibido:', usuario)),
      catchError(error => {
        console.error('[UsuariosService] Error al obtener usuario:', error);
        return throwError(() => error);
      })
    );
  }

  ActualizarUsuario(usuario: Usuario) {
    console.log('[UsuariosService] Actualizando usuario:', usuario);
    const pa = JSON.stringify({
      accion: "ActualizarUsuario",
      usuario
    });

    return this.http.post<any>(this.url, pa).pipe(
      tap(response => console.log('[UsuariosService] Respuesta actualización:', response)),
      catchError(error => {
        console.error('[UsuariosService] Error al actualizar usuario:', error);
        return throwError(() => error);
      })
    );
  }

  EliminarUsuario(id: number) {
    const pa = JSON.stringify({
      accion: "EliminarUsuario",
      usuario: { id }
    });
    return this.http.post(this.url, pa);
  }
}
