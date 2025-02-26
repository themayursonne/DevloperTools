import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-text-utilities',
  standalone: true,
  imports: [FormsModule, NgIf, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
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
    this.textInput = typeof window !== 'undefined' ? localStorage.getItem('textInput') || '' : '';
  }

  get wordCount(): number {
    return this.textInput.split(/\s+/).filter(word => word.length > 0).length;
  }

  toUpperCase() {
    this.textInput = this.textInput.toUpperCase();
    this.saveToLocalStorage();
  }

  toLowerCase() {
    this.textInput = this.textInput.toLowerCase();
    this.saveToLocalStorage();
  }

  toTitleCase() {
    this.textInput = this.textInput.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
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
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\s*([.!?])\s*/g, '$1 ') // Normalize punctuation spacing
      .toLowerCase()
      .replace(/(^|\s)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase()); // Title case sentences
    this.errorMessage = '';
  }

  saveToLocalStorage() {
    if (typeof window !== 'undefined') {
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
    if (this.formattedText || this.textInput) {
      const textToCopy = this.formattedText || this.textInput;
      this.clipboard.copy(textToCopy);
      this.errorMessage = 'Text copied to clipboard!';
      setTimeout(() => (this.errorMessage = ''), 3000); // Clear message after 3 seconds
    } else {
      this.errorMessage = 'No text to copy.';
    }
  }

  toggleHowToUse() {
    this.showHowToUse = !this.showHowToUse;
  }
}