import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToolLayoutComponent } from '../shared/tool-layout.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [
    ToolLayoutComponent,
    FormsModule,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
  ],
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
})
export class JsonEditorComponent implements OnInit, AfterViewInit {
  jsonInput: string = '';
  formattedJson: string = '';
  errorMessage: string = '';
  viewMode: 'text' = 'text';
  lineNumbers: number[] = [1];

  private isBrowser: boolean;

  @ViewChild('jsonInputTextarea', { static: false })
  jsonInputTextarea!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private clipboard: Clipboard,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.jsonInput = localStorage.getItem('jsonInput') || '';
    } else {
      this.jsonInput = '';
    }
    this.updateLineNumbers();
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      const textarea = this.jsonInputTextarea.nativeElement;
      textarea.addEventListener('scroll', () => this.syncScroll());
      this.updateLineNumbers();
    }
  }

  onJsonInputChange(): void {
    this.updateLineNumbers();
    this.saveToLocalStorage();
  }

  updateLineNumbers(): void {
    const lines = this.jsonInput ? this.jsonInput.split('\n').length : 1;
    this.lineNumbers = Array.from({ length: lines }, (_, i) => i + 1);
  }

  syncScroll(): void {
    const textarea = this.jsonInputTextarea.nativeElement;
    const lineNumbersInner = document.querySelector(
      '.input-line-numbers-inner'
    ) as HTMLDivElement;
    if (lineNumbersInner) {
      lineNumbersInner.style.top = `-${textarea.scrollTop}px`;
    }
  }

  formatJson(): void {
    if (!this.jsonInput.trim()) {
      this.errorMessage = 'Please enter JSON to format.';
      return;
    }
    this.formattedJson = this.formatJsonWithDuplicates(this.jsonInput);
    this.errorMessage = 'Formatted successfully!';
  }

  formatJsonWithDuplicates(jsonStr: string): string {
    let indentLevel = 0;
    const indent = '  ';
    let result = '';
    let inString = false;
    let prevChar = '';

    for (let i = 0; i < jsonStr.length; i++) {
      const char = jsonStr[i];
      if (inString) {
        result += char;
        if (char === '"' && prevChar !== '\\') {
          inString = false;
        }
      } else {
        if (char === '"') {
          inString = true;
          result += char;
        } else {
          switch (char) {
            case '{':
            case '[':
              result += char + '\n';
              indentLevel++;
              result += indent.repeat(indentLevel);
              break;
            case '}':
            case ']':
              result += '\n';
              indentLevel--;
              result += indent.repeat(indentLevel) + char;
              break;
            case ',':
              result += char + '\n' + indent.repeat(indentLevel);
              break;
            case ':':
              result += char + ' ';
              break;
            case ' ':
            case '\n':
            case '\t':
              if (result.slice(-1) !== ' ' && result.slice(-1) !== '\n') {
                result += ' ';
              }
              break;
            default:
              result += char;
          }
        }
      }
      prevChar = char;
    }
    return result.trim();
  }

  validateJson(): void {
    if (!this.jsonInput.trim()) {
      this.errorMessage = 'Please enter JSON to validate.';
      console.warn(this.errorMessage);
      return;
    }

    try {
      JSON.parse(this.jsonInput);
      this.errorMessage = '✅ Valid JSON!';
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      this.errorMessage = `❌ Invalid JSON: ${msg}`;
      console.error(this.errorMessage);
    }
  }

  clearInput(): void {
    this.jsonInput = '';
    this.formattedJson = '';
    this.errorMessage = '';
    if (this.isBrowser) {
      localStorage.removeItem('jsonInput');
    }
    this.updateLineNumbers();
  }

  copyResult(): void {
    const content = this.formattedJson || this.jsonInput;
    if (content) {
      this.clipboard.copy(content);
      this.errorMessage = 'Copied to clipboard!';
      setTimeout(() => (this.errorMessage = ''), 2000);
    }
  }
  //save
  saveToLocalStorage(): void {
    if (this.isBrowser) {
      localStorage.setItem('jsonInput', this.jsonInput);
    }
  }
}
