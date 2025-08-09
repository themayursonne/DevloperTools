import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  apps = [
     { name: 'JSON Editor', route: '/json-editor', icon: '📝', description: 'Edit, format, and validate JSON data easily.' },
    { name: 'Text Utilities', route: '/text-utilities', icon: '🔤', description: 'Useful text transformations and tools.' },
    { name: 'Code Beautifier', route: '/code-beautifier', icon: '💻', description: 'Beautify and format your code instantly.' },
    { name: 'Image Size Converter', route: '/image-size-converter', icon: '🖼️', description: 'Resize and optimize images easily.' },
    { name: 'Column to Row Converter', route: '/columntorow', icon: '↔️', description: 'Convert columns of data to rows.' },
    { name: 'Base64 Tool', route: '/base64-tool', icon: '🔐', description: 'Encode or decode Base64 data.' }
  ];

  constructor(private router: Router) {}

  openApp(route: string) {
    this.router.navigate([route]);
  }
}
