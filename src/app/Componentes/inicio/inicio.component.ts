import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio', 
  imports: [CommonModule, RouterModule], 
  templateUrl: './inicio.component.html',
})
export class InicioComponent {

  constructor(private peticion:UsuariosService, private ruta:Router, public auth: UsuariosService){
  }


}