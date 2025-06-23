import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-base64-tool',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  templateUrl: './base64-tool.component.html',
  styleUrls: ['./base64-tool.component.scss']
})
export class Base64ToolComponent {
  constructor(private title: Title, private meta: Meta,@Inject(DOCUMENT) private document: Document) {
    this.title.setTitle('Base64 Encode Decode Tool – DeveloperTools');
    this.meta.updateTag({
      name: 'description',
      content: 'Free online Base64 Encoder & Decoder for developers. Convert text to base64 or decode it easily.'
    });
    const link: HTMLLinkElement = this.document.createElement('link');
  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', 'https://www.developertools.com/base64-tool');
  this.document.head.appendChild(link);
  }
  input = '';
  output = '';
  mode: string = 'encode';
  charset = 'utf-8';
  liveMode = true;
  lineByLine = false;

  // Character sets supported by TextDecoder (decode only)
  charsets = [
    'utf-8',
    'utf-16le',
    'utf-16be',
    'windows-1252',
    'iso-8859-1',
    'shift_jis',
    'gbk',
    'euc-kr'
  ];

  process(): void {
    try {
      if (this.mode === 'encode') {
        this.output = this.lineByLine
          ? this.input.split('\n').map(line => this.encode(line)).join('\n')
          : this.encode(this.input);
      } else {
        this.output = this.lineByLine
          ? this.input.split('\n').map(line => this.decode(line)).join('\n')
          : this.decode(this.input);
      }
    } catch (e) {
      this.output = '❌ Error: Invalid input or character set.';
    }
  }

  encode(text: string): string {
    const encoder = new TextEncoder(); // utf-8 only
    const encoded = encoder.encode(text);
    return btoa(String.fromCharCode(...encoded));
  }

  decode(base64: string): string {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    const decoder = new TextDecoder(this.charset);
    return decoder.decode(bytes);
  }

  onModeChange() {
    this.input = '';
    this.output = '';
  }
}
