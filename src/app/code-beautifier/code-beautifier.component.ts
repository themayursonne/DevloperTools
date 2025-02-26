import { Component, OnInit } from '@angular/core';
import * as prettier from 'prettier';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard'; // For copy functionality

@Component({
  selector: 'app-code-beautifier',
  standalone: true,
  imports: [FormsModule, NgIf, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './code-beautifier.component.html',
  styleUrls: ['./code-beautifier.component.scss']
})
export class CodeBeautifierComponent implements OnInit {
  selectedLanguage: string = 'javascript';
  codeInput: string = '';
  beautifiedCode: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showHowToUse: boolean = false;

  constructor(private clipboard: Clipboard) {} // Inject Clipboard for copy functionality

  ngOnInit() {
    this.codeInput = typeof window !== 'undefined' ? localStorage.getItem('codeInput') || '' : '';
  }

  async beautifyCode() {
    if (!this.codeInput.trim()) {
      this.errorMessage = 'Please enter code to beautify.';
      this.beautifiedCode = '';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    try {
      const parser = this.getParserForLanguage();
      const options = { parser, singleQuote: true, tabWidth: 2, useTabs: false };
      this.beautifiedCode = await prettier.format(this.codeInput, options);
    } catch (e: unknown) {
      this.errorMessage = `Error formatting code: ${this.getErrorMessage(e) || 'Invalid code or parser issue'}`;
      this.beautifiedCode = '';
    } finally {
      this.isLoading = false;
    }
  }

  private getParserForLanguage(): string {
    switch (this.selectedLanguage) {
      case 'javascript':
        return 'babel';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      default:
        return 'babel';
    }
  }

  private getErrorMessage(error: unknown): string | undefined {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('codeInput', this.codeInput);
    }
  }

  clearInput() {
    this.codeInput = '';
    this.beautifiedCode = '';
    this.errorMessage = '';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('codeInput');
    }
  }

  copyResult() {
    if (this.beautifiedCode && typeof window !== 'undefined') {
      this.clipboard.copy(this.beautifiedCode);
      this.errorMessage = 'Code copied to clipboard!';
      setTimeout(() => (this.errorMessage = ''), 3000); // Clear message after 3 seconds
    } else {
      this.errorMessage = 'No code to copy.';
    }
  }

  toggleHowToUse() {
    this.showHowToUse = !this.showHowToUse;
  }
}