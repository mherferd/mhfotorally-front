import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Componentes/header/header.component';
import { FooterComponent } from './Componentes/footer/footer.component'; 

@Component({
  selector: 'app-root',
   templateUrl: './app.component.html', 
    styleUrls: ['./app.component.css'],   
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HeaderComponent,
    FooterComponent,
  ],
  
})
export class AppComponent {
  title = 'MHFotoRally';
}


