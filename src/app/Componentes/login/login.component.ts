import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../../Servicios/usuarios.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None 

})
export class LoginComponent {
  email: string = '';
  password: string = '';
  mensajeError: string = '';

  constructor(private authService: UsuariosService) {}


  onSubmit() {
    if (!this.email || !this.password) {
      this.mensajeError = 'Por favor ingresa email y contraseña';
      return; 
    }

    this.mensajeError = '';
    this.authService.login(this.email, this.password);
  }
}