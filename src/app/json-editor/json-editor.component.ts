import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Clipboard } from '@angular/cdk/clipboard';

interface JsonTreeNode {
  key: string;
  value: any;
  children?: JsonTreeNode[];
}

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule],
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class JsonEditorComponent implements OnInit, AfterViewInit {
  jsonInput: string = '';
  formattedJson: string = '';
  errorMessage: string = '';
  viewMode: 'text' | 'tree' = 'text';
  jsonTree: JsonTreeNode[] = [];
  lineNumbers: number[] = [1]; // Added to manage line numbers

  @ViewChild('jsonInputDiv') jsonInputDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('jsonInputTextarea', { static: false }) jsonInputTextarea!: ElementRef<HTMLTextAreaElement>; // Updated type

  constructor(private clipboard: Clipboard) {}

  ngOnInit() {
    this.jsonInput = typeof window !== 'undefined' ? localStorage.getItem('jsonInput') || '' : '';
    this.updateLineNumbers(); // Initialize line numbers
    this.updateJsonTree();
  }

  ngAfterViewInit() {
    const textarea = this.jsonInputTextarea.nativeElement;
    const lineNumbersDiv = document.querySelector('.input-line-numbers') as HTMLDivElement;
    if (lineNumbersDiv) {
      lineNumbersDiv.style.height = `${textarea.clientHeight}px`; // Match height with textarea
    }
    textarea.addEventListener('scroll', () => {
      this.syncScroll(); // Sync line numbers with textarea scroll
    });
  }

  // Added method to handle input changes via ngModel
  onJsonInputChange() {
    this.updateLineNumbers(); // Update line numbers on input change
    this.saveToLocalStorage(); // Save and update tree as in original flow
  }

  // Added method to update line numbers based on jsonInput
  updateLineNumbers() {
    const lines = this.jsonInput ? this.jsonInput.split('\n').length : 1;
    this.lineNumbers = Array.from({ length: lines }, (_, i) => i + 1);
  }

  // Added method to synchronize line numbers scrolling with textarea
  syncScroll() {
    const textarea = this.jsonInputTextarea.nativeElement;
    const lineNumbersInner = document.querySelector('.input-line-numbers-inner') as HTMLDivElement;
    if (lineNumbersInner) {
      lineNumbersInner.style.top = `-${textarea.scrollTop}px`; // Adjust position
    }
  }

  // Existing method, unchanged
  onInput(event: Event) {
    const target = event.target as HTMLDivElement;
    this.jsonInput = target.innerText;
    this.saveToLocalStorage();
    this.updateJsonTree();
  }

  getLineNumbers(text: string): number[] {
    return text.split('\n').map((_, index) => index + 1);
  }

  getJsonWithLineNumbers(text: string): string {
    const lines = text.split('\n');
    const lineNumbers = this.getLineNumbers(text);
    return lines.map((line, index) => 
      `<span class="line"><span class="line-number">${lineNumbers[index]}</span>${line || '<br>'}</span>`
    ).join('\n');
  }

  get jsonInputWithLineNumbers(): string {
    return this.getJsonWithLineNumbers(this.jsonInput);
  }

  get formattedJsonWithLineNumbers(): string {
    return this.getJsonWithLineNumbers(this.formattedJson);
  }

  formatJson() {
    if (!this.jsonInput.trim()) {
      this.errorMessage = 'Please enter JSON to format.';
      this.formattedJson = '';
      this.jsonTree = [];
      return;
    }
    try {
      const parsed = JSON.parse(this.jsonInput);
      this.formattedJson = JSON.stringify(parsed, null, 2);
      this.errorMessage = '';
      this.updateJsonTree();
    } catch (e: unknown) {
      this.errorMessage = `Invalid JSON: ${this.getErrorMessage(e) || 'Syntax error'}`;
      this.formattedJson = '';
      this.jsonTree = [];
    }
  }

  validateJson() {
    if (!this.jsonInput.trim()) {
      this.errorMessage = 'Please enter JSON to validate.';
      return;
    }
    try {
      JSON.parse(this.jsonInput);
      this.errorMessage = 'Valid JSON';
      this.updateJsonTree();
    } catch (e: unknown) {
      this.errorMessage = `Invalid JSON: ${this.getErrorMessage(e) || 'Syntax error'}`;
    }
  }

  private updateJsonTree() {
    if (!this.jsonInput.trim()) {
      this.jsonTree = [];
      return;
    }
    try {
      const parsed = JSON.parse(this.jsonInput);
      this.jsonTree = this.parseToTree(parsed);
      console.log('JSON Tree:', this.jsonTree);
    } catch (e: unknown) {
      this.jsonTree = [];
      console.error('Error parsing JSON for tree:', e);
    }
  }

  private parseToTree(obj: any, prefix: string = ''): JsonTreeNode[] {
    const tree: JsonTreeNode[] = [];
    if (obj === null || obj === undefined) {
      tree.push({ key: prefix || 'null', value: null, children: [] });
      return tree;
    }
    if (typeof obj !== 'object') {
      tree.push({ key: prefix || 'value', value: obj, children: [] });
      return tree;
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        tree.push(...this.parseToTree(item, `${prefix}[${index}]`));
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        const node: JsonTreeNode = { key: prefix ? `${prefix}.${key}` : key, value, children: [] };
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          node.children = this.parseToTree(value, '');
        } else if (Array.isArray(value)) {
          node.children = this.parseToTree(value, '');
        }
        tree.push(node);
      });
    }
    return tree;
  }

  private getErrorMessage(error: unknown): string | undefined {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
    if (Array.isArray(value)) return `[${value.length} items]`;
    if (typeof value === 'object') return `{${Object.keys(value).length} properties}`;
    return String(value);
  }

  saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jsonInput', this.jsonInput);
    }
    this.updateJsonTree();
  }

  clearInput() {
    this.jsonInput = '';
    this.formattedJson = '';
    this.errorMessage = '';
    this.jsonTree = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jsonInput');
    }
    this.updateLineNumbers(); // Update line numbers when clearing
  }

  copyResult() {
    if (this.formattedJson && typeof window !== 'undefined') {
      this.clipboard.copy(this.formattedJson);
      this.errorMessage = 'JSON copied to clipboard!';
      setTimeout(() => (this.errorMessage = ''), 3000);
    } else if (this.jsonInput && typeof window !== 'undefined') {
      this.clipboard.copy(this.jsonInput);
      this.errorMessage = 'Raw JSON copied to clipboard!';
      setTimeout(() => (this.errorMessage = ''), 3000);
    } else {
      this.errorMessage = 'No JSON to copy.';
    }
  }
}