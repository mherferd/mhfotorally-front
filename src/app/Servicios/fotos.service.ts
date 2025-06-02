// servicios/fotos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Foto } from '../Modelos/foto';
import { Voto } from '../Modelos/voto';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { of } from 'rxjs';
import { UsuariosService } from './usuarios.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FotosService {
  private url = 'http://15.236.209.101/servicios.php';
  private baseUrl = 'http://15.236.209.101/imagenes/';


  constructor(private http: HttpClient, private usuariosService: UsuariosService) { }

  subirFoto(archivo: File, fotoData: any): Observable<any> {


    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('titulo', fotoData.titulo);
    formData.append('descripcion', fotoData.descripcion || '');
    formData.append('usuario_id', fotoData.usuario_id.toString());
    formData.append('peticion', 'crearFoto');

    return this.http.post(this.url, formData);
  }


  listarFotos(filtroEstado?: string): Observable<Foto[]> {
    const usuarioId = this.usuariosService.usuarioLogueado?.id;

    return this.http.post<any>(this.url, {
      accion: "ListarFotografias",
      filtroEstado: filtroEstado,
      usuarioId: usuarioId
    }).pipe(
      map(response => {
        if (!response) {
          console.warn('La respuesta del servidor está vacía');
          return [];
        }

        if (!Array.isArray(response)) {
          console.error('La respuesta no es un array:', response);
          return [];
        }

        return response.map((foto: any) => ({
          ...foto,
          url: foto.url.startsWith('http') ? foto.url : `${this.baseUrl}${foto.url}`,
          usuario: {
            id: foto.usuario_id,
            nombre: foto.usuario_nombre,
            apellidos: foto.usuario_apellidos
          },
          likes: foto.likes || 0,
          dislikes: foto.dislikes || 0,
          miVoto: foto.mi_voto || null
        }));
      }),
      catchError(error => {
        console.error('Error al obtener fotos:', error);
        return of([]);
      })
    );
  }

  obtenerFoto(id: number): Observable<Foto> {
    const pa = JSON.stringify({
      accion: "ObtenerFoto",
      foto: { id }
    });
    return this.http.post<Foto>(this.url, pa);
  }

  listarFotosUsuario(usuarioId: number): Observable<Foto[]> {
    const body = {
      accion: "ListarFotografiasUsuario",
      usuario: { id: usuarioId }
    };

    return this.http.post(this.url, body, { responseType: 'text' }).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response);
        const jsonStart = response.indexOf('[');
        const jsonEnd = response.lastIndexOf(']') + 1;
        const jsonData = jsonStart >= 0 ? response.slice(jsonStart, jsonEnd) : '[]';

        try {
          const fotos = JSON.parse(jsonData) as any[];
          return fotos.map(foto => ({
            ...foto,
            url: foto.url.startsWith('http') ? foto.url :
              `http://15.236.209.101/imagenes/${foto.url}`,
            titulo: foto.titulo || 'Sin título'
          }));
        } catch (e) {
          console.error('Error parsing JSON:', e);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error en listarFotosUsuario:', error);
        return of([]);
      })
    );
  }

  actualizarFoto(foto: any): Observable<any> {
    const pa = JSON.stringify({
      accion: "ActualizarFoto",
      foto: foto
    });

    return this.http.post(this.url, pa, { responseType: 'text' }).pipe(
      map(response => {
        const jsonStart = response.indexOf('{');
        if (jsonStart > 0) {
          response = response.substring(jsonStart);
        }
        return JSON.parse(response);
      }),
      catchError(error => {
        console.error('Error en actualizarFoto:', error);
        return of({
          success: false,
          error: 'Error al procesar la respuesta del servidor'
        });
      })
    );
  }
  eliminarFoto(id: number): Observable<any> {
    const pa = JSON.stringify({
      accion: "EliminarFoto",
      foto: { id }
    });
    return this.http.post(this.url, pa);
  }

  votarFoto(fotoId: number, valoracion: number): Observable<any> {
    const usuarioId = this.usuariosService.usuarioLogueado?.id;
    if (!usuarioId) {
      return throwError(() => 'Usuario no identificado');
    }

    const body = {
      accion: "CrearVoto",
      voto: {
        foto_id: fotoId,
        usuario_id: usuarioId,
        valoracion: valoracion
      }
    };

    return this.http.post<any>(this.url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error al votar';
        if (error.error?.error) {
          errorMessage = error.error.error;
        }
        return throwError(() => errorMessage);
      })
    );
  }
  listarVotos(fotoId: number): Observable<Voto[]> {
    const pa = JSON.stringify({
      accion: "ListarVotosFoto",
      foto: { id: fotoId }
    });
    return this.http.post<Voto[]>(this.url, pa);
  }

  obtenerEstadisticasVotos(usuarioId: number): Observable<{ total_likes: number, total_dislikes: number }> {
    const body = {
      accion: "ObtenerEstadisticasVotos",
      usuario_id: usuarioId
    };

    return this.http.post<{ total_likes: number, total_dislikes: number }>(this.url, body).pipe(
      catchError(error => {
        console.error('Error obteniendo estadísticas de votos:', error);
        return of({ total_likes: 0, total_dislikes: 0 });
      })
    );
  }

  actualizarFotoConImagen(fotoId: number, archivo: File, titulo: string, descripcion: string): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('foto_id', fotoId.toString());
    formData.append('accion', 'ActualizarFoto');

    return this.http.post(this.url, formData).pipe(
      catchError(error => {
        console.error('Error al actualizar foto con imagen:', error);
        return throwError(() => error);
      })
    );
  }

  ObtenerFoto(foto: { id: number }): Observable<Foto> {
    const pa = JSON.stringify({
      accion: "ObtenerFoto",
      foto: { id: foto.id }
    });
    return this.http.post<Foto>(this.url, pa);
  }




}