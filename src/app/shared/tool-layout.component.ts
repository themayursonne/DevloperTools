import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf and *ngFor
import { MatCardModule } from '@angular/material/card'; // Required for mat-card
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tool-layout',
  standalone: true, // Ensure standalone mode
  imports: [CommonModule, MatCardModule, MatButtonModule], // Import Angular Material & CommonModule
  templateUrl: './tool-layout.component.html',
  styleUrls: ['./tool-layout.component.scss']
})
export class ToolLayoutComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() howToUse: string[] = [];
}
