import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToolLayoutComponent } from '../shared/tool-layout.component';

@Component({
  selector: 'app-text-utilities',
  standalone: true,
  imports: [ToolLayoutComponent,FormsModule, NgIf, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './text-utilities.component.html',
  styleUrls: ['./text-utilities.component.scss']
})
export class TextUtilitiesComponent implements OnInit {
  textInput: string = '';
  formattedText: string = '';
  errorMessage: string = '';
  showHowToUse: boolean = false;

  constructor(private clipboard: Clipboard) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.textInput = localStorage.getItem('textInput') || '';
    }
  }

  get wordCount(): number {
    return this.textInput.trim() ? this.textInput.trim().split(/\s+/).length : 0;
  }

  toUpperCase() {
    this.textInput = this.textInput.toUpperCase();
    this.saveToLocalStorage();
  }

  toLowerCase() {
    this.textInput = this.textInput.toLowerCase();
    this.saveToLocalStorage();
  }
  updateWordCount() {
    // ✅ Fix: This function now exists to prevent template errors
    this.wordCount;
  }
  toTitleCase() {
  this.textInput = this.textInput
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
  this.saveToLocalStorage();
}

  removeExtraSpaces() {
    this.textInput = this.textInput.replace(/\s+/g, ' ').trim();
    this.saveToLocalStorage();
  }

  formatText() {
    if (!this.textInput.trim()) {
      this.errorMessage = 'Please enter text to format.';
      this.formattedText = '';
      return;
    }

    this.formattedText = this.textInput
      .replace(/\s+/g, ' ') // Remove extra spaces
      .trim()
      .replace(/([.!?])\s*(\w)/g, (match, p1, p2) => `${p1} ${p2.toUpperCase()}`) // Fix punctuation spacing
      .replace(/^\w/, char => char.toUpperCase()); // Capitalize first letter

    this.errorMessage = '';
  }

  saveToLocalStorage() {
    if (typeof window !== 'undefined' && this.textInput !== localStorage.getItem('textInput')) {
      localStorage.setItem('textInput', this.textInput);
    }
  }

  clearInput() {
    this.textInput = '';
    this.formattedText = '';
    this.errorMessage = '';
    if (typeof window !== 'undefined') {
      localStorage.removeItem('textInput');
    }
  }

  copyResult() {
    const textToCopy = this.formattedText || this.textInput;
    if (textToCopy) {
      this.clipboard.copy(textToCopy);
      this.errorMessage = '✅ Text copied!';
      setTimeout(() => (this.errorMessage = ''), 3000);
    } else {
      this.errorMessage = '⚠ No text to copy.';
    }
  }

  toggleHowToUse() {
    this.showHowToUse = !this.showHowToUse;
  }
}
