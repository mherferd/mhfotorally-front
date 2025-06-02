import { Component } from '@angular/core';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-estadios-futbol',
  imports: [RouterModule],
  templateUrl: './estadios-futbol.component.html',
  styleUrl: './estadios-futbol.component.css'
})
export class EstadiosFutbolComponent {
  constructor(public authService: UsuariosService) {}

}
