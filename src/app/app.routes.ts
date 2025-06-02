import { Routes } from '@angular/router';
import { InicioComponent } from './Componentes/inicio/inicio.component';
import { RegistroComponent } from './Componentes/registro/registro.component';
import { LoginComponent } from './Componentes/login/login.component';
import { PerfilComponent } from './Componentes/perfil/perfil.component';
import { ParticipanteComponent } from './Componentes/participante/participante.component';
import { AdminComponent } from './Componentes/admin/admin.component';
import { SubirFotoComponent } from './Componentes/subir-foto/subir-foto.component';
import { GaleriaComponent } from './Componentes/galeria/galeria.component';
import { AdminFotosComponent } from './Componentes/admin-fotos/admin-fotos.component';
import { MisFotosComponent } from './Componentes/mis-fotos/mis-fotos.component';
import { AdminUsuariosComponent } from './Componentes/admin-usuarios/admin-usuarios.component';
import { EditarUsuarioComponent } from './Componentes/editar-usuario/editar-usuario.component';
import { EstadiosFutbolComponent } from './Componentes/estadios-futbol/estadios-futbol.component';
import { NuevoUsuarioComponent } from './Componentes/nuevo-usuario/nuevo-usuario.component';
import { EditarFotoComponent } from './Componentes/editar-foto/editar-foto.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'participante', component: ParticipanteComponent },
  { path: 'subir-foto', component: SubirFotoComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'admin/fotos', component: AdminFotosComponent },
  { path: 'mis-fotos', component: MisFotosComponent },
  { path: 'admin/usuarios', component: AdminUsuariosComponent },
  { path: 'estadios-futbol', component: EstadiosFutbolComponent },
  { path: 'admin/usuarios/editar/:id', component: EditarUsuarioComponent },
  { path: 'admin/usuarios/nuevo', component: NuevoUsuarioComponent },
  { path: 'mis-fotos/editar/:id', component: EditarFotoComponent },

];