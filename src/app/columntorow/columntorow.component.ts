import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToolLayoutComponent } from '../shared/tool-layout.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-columntorow',
  standalone: true,
  imports: [
    ToolLayoutComponent,
    FormsModule,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './columntorow.component.html',
  styleUrls: ['./columntorow.component.scss'],
})
export class ColumnToRowComponent implements OnInit {
  excelColumnInput: string = '';
  csvOutput: string = '';
  csvErrorMessage: string = '';
  private isBrowser: boolean;

  constructor(
    private clipboard: Clipboard,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.excelColumnInput = localStorage.getItem('excelColumnInput') || '';
    }
  }

  convertExcelToCsv(): void {
    if (!this.excelColumnInput.trim()) {
      this.csvErrorMessage = 'Please paste Excel column data.';
      return;
    }

    const items = this.excelColumnInput
      .trim()
      .split('\n')
      .map(item => item.trim())
      .filter(item => item !== '');

    this.csvOutput = items.join(',');
    this.csvErrorMessage = 'Converted successfully!';
    this.saveToLocalStorage();
  }

  clearExcelInput(): void {
    this.excelColumnInput = '';
    this.csvOutput = '';
    this.csvErrorMessage = '';
    if (this.isBrowser) {
      localStorage.removeItem('excelColumnInput');
    }
  }

  copyCsvOutput(): void {
    if (this.csvOutput) {
      this.clipboard.copy(this.csvOutput);
      this.csvErrorMessage = 'Copied to clipboard!';
      setTimeout(() => (this.csvErrorMessage = ''), 2000);
    }
  }

  saveToLocalStorage(): void {
    if (this.isBrowser) {
      localStorage.setItem('excelColumnInput', this.excelColumnInput);
    }
  }
}
