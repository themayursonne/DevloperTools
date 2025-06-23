import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    NavigationComponent, // Import the navigation component
    RouterOutlet, // For routing
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}