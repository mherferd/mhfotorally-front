import { Usuario } from './usuario';
import { Voto } from './voto';

export interface FotoUpdate {
  id: number;
  estado: 'pendiente' | 'admitida' | 'rechazada';
  motivo_rechazo?: string;
  titulo?: string;
  descripcion?: string;
}

export interface Foto extends FotoUpdate {
  usuario_id: number;
  url: string;
  titulo: string;
  descripcion: string;
  fecha_subida?: string;
  votos?: Voto[];
  usuario?: Usuario;
  likes?: number;
  dislikes?: number;
  miVoto?: number;
  cargandoVoto?: boolean; 
}

