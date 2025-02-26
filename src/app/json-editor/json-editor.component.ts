import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule],
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
})
export class JsonEditorComponent implements OnInit, AfterViewInit {
  jsonInput: string = '';
  formattedJson: string = '';
  errorMessage: string = '';
  viewMode: 'text' = 'text';
  lineNumbers: number[] = [1];

  @ViewChild('jsonInputTextarea', { static: false }) jsonInputTextarea!: ElementRef<HTMLTextAreaElement>;

  constructor(private clipboard: Clipboard) {}

  ngOnInit() {
    this.jsonInput = localStorage.getItem('jsonInput') || '';
    this.updateLineNumbers();
  }

  ngAfterViewInit() {
    const textarea = this.jsonInputTextarea.nativeElement;
    textarea.addEventListener('scroll', () => this.syncScroll());
    this.updateLineNumbers();
  }

  onJsonInputChange() {
    this.updateLineNumbers();
    this.saveToLocalStorage();
  }

  updateLineNumbers() {
    const lines = this.jsonInput ? this.jsonInput.split('\n').length : 1;
    this.lineNumbers = Array.from({ length: lines }, (_, i) => i + 1);
  }

  syncScroll() {
    const textarea = this.jsonInputTextarea.nativeElement;
    const lineNumbersInner = document.querySelector('.input-line-numbers-inner') as HTMLDivElement;
    if (lineNumbersInner) {
      lineNumbersInner.style.top = `-${textarea.scrollTop}px`;
    }
  }

  formatJson() {
    if (!this.jsonInput.trim()) {
      this.errorMessage = 'Please enter JSON to format.';
      return;
    }

    try {
      const parsed = JSON.parse(this.jsonInput);
      this.formattedJson = JSON.stringify(parsed, null, 2);
      this.errorMessage = 'Formatted successfully!';
    } catch (e) {
      this.errorMessage = 'Invalid JSON: Syntax error.';
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
    } catch (e) {
      this.errorMessage = 'Invalid JSON: Syntax error.';
    }
  }

  clearInput() {
    this.jsonInput = '';
    this.formattedJson = '';
    this.errorMessage = '';
    localStorage.removeItem('jsonInput');
    this.updateLineNumbers();
  }

  copyResult() {
    const contentToCopy = this.formattedJson || this.jsonInput;
    if (contentToCopy) {
      this.clipboard.copy(contentToCopy);
      this.errorMessage = 'Copied to clipboard!';
      setTimeout(() => (this.errorMessage = ''), 2000);
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('jsonInput', this.jsonInput);
  }
}
