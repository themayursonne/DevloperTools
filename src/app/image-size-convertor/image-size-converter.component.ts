import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-image-size-converter',
  templateUrl: './image-size-converter.component.html',
  styleUrls: ['./image-size-converter.component.scss'],
  standalone: true, // Indicates standalone component usage
  imports: [
    CommonModule,       // Enables *ngIf, *ngFor
    FormsModule,        // Enables [(ngModel)] two-way binding
    MatCardModule,      // Enables <mat-card>
    MatFormFieldModule, // Enables <mat-form-field>
    MatInputModule,     // Enables <mat-input>
    MatButtonModule     // Enables <button mat-raised-button>
  ]
})
export class ImageSizeConverterComponent {
  originalImage: File | null = null;
  resizedImageURL: string | null = null;
  targetSizeKB: number = 100; // Default target size in KB
  loading = false;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.originalImage = file;
    } else {
      alert('Please select a valid image file.');
    }
  }

  async resizeImage(): Promise<void> {
    if (!this.originalImage) {
      alert('Please upload an image first.');
      return;
    }

    this.loading = true;
    try {
      const resizedBlob = await this.compressImage(this.originalImage, this.targetSizeKB);
      this.resizedImageURL = URL.createObjectURL(resizedBlob);
    } catch (error) {
      console.error('Image resizing error:', error);
      alert('Something went wrong during image resizing.');
    }
    this.loading = false;
  }

  /**
   * compressImage
   *  - If the original image is bigger than targetSizeKB, it will shrink dimensions (binary search).
   *  - If original image is smaller, it will expand dimensions (also via binary search) up to a max factor.
   *  - After dimension-based scaling, if still over targetSizeKB in shrink scenario, we do a small
   *    quality-based reduction pass. This approach helps maintain higher visual fidelity.
   */
  compressImage(file: File, targetSizeKB: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result;
      };
      reader.onerror = (err) => {
        reject(err);
      };

      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Helper: Convert given width & height into a JPEG blob at specified quality
        const getBlob = (width: number, height: number, quality: number): Promise<Blob> => {
          return new Promise((res, rej) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              return rej('Canvas 2D context not available.');
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  return rej('Failed to create blob from canvas.');
                }
                res(blob);
              },
              'image/jpeg',
              quality
            );
          });
        };

        // Helper: Return size in KB
        const getSizeKB = (blob: Blob): number => blob.size / 1024;

        // 1) Get the original image size
        getBlob(originalWidth, originalHeight, 1.0)
          .then(async (originalBlob) => {
            const originalSizeKB = getSizeKB(originalBlob);

            // Quick check: if already near target, skip further processing
            if (Math.abs(originalSizeKB - targetSizeKB) < 5) {
              return resolve(originalBlob);
            }

            const needShrink = originalSizeKB > targetSizeKB;

            // BINARY SEARCH on dimension scale
            let minScale = 0.05; // 5% of original
            let maxScale = 4.0;  // up to 400% of original for upscaling
            let bestBlob = originalBlob;
            let bestDiff = Math.abs(originalSizeKB - targetSizeKB);

            // We'll do ~7 iterations, enough for a good approximation
            for (let i = 0; i < 7; i++) {
              const midScale = (minScale + maxScale) / 2;
              const scaledW = Math.max(1, Math.floor(originalWidth * midScale));
              const scaledH = Math.max(1, Math.floor(originalHeight * midScale));

              const testBlob = await getBlob(scaledW, scaledH, 1.0);
              const testSizeKB = getSizeKB(testBlob);
              const diff = Math.abs(testSizeKB - targetSizeKB);

              // Track best so far
              if (diff < bestDiff) {
                bestDiff = diff;
                bestBlob = testBlob;
              }

              if (needShrink) {
                // If we need to shrink, but still bigger than target => reduce scale
                if (testSizeKB > targetSizeKB) {
                  maxScale = midScale;
                } else {
                  // We've gone below target => scale up a bit
                  minScale = midScale;
                }
              } else {
                // Need to enlarge
                if (testSizeKB < targetSizeKB) {
                  // too small => go bigger
                  minScale = midScale;
                } else {
                  // we've exceeded => go smaller
                  maxScale = midScale;
                }
              }
            }

            // After dimension-based approach, check if still above target (shrink scenario)
            const finalSizeKB = getSizeKB(bestBlob);
            if (needShrink && finalSizeKB > targetSizeKB) {
              // 2) Small binary search on JPEG quality (only needed if still too large)
              let qMin = 0.05;
              let qMax = 1.0;
              let lastBestDiff = finalSizeKB - targetSizeKB;

              // We'll re-derive scaled width/height from bestBlob:
              // Easiest is to do a final pass with the final scale we ended on:
              const finalScale = (minScale + maxScale) / 2;
              const scaledW = Math.max(1, Math.floor(originalWidth * finalScale));
              const scaledH = Math.max(1, Math.floor(originalHeight * finalScale));

              let bestQualityBlob = bestBlob;
              for (let i = 0; i < 5; i++) {
                const midQ = (qMin + qMax) / 2;
                const testBlob = await getBlob(scaledW, scaledH, midQ);
                const testSizeKB = getSizeKB(testBlob);

                const diff = testSizeKB - targetSizeKB;
                if (Math.abs(diff) < Math.abs(lastBestDiff)) {
                  lastBestDiff = diff;
                  bestQualityBlob = testBlob;
                }

                if (testSizeKB > targetSizeKB) {
                  qMax = midQ; // too big => lower quality
                } else {
                  qMin = midQ; // under target => raise quality (if we want exact approach)
                }
              }
              return resolve(bestQualityBlob);
            }

            // Otherwise (including enlarge scenario), just return the dimension-optimized blob
            return resolve(bestBlob);
          })
          .catch((err) => {
            reject(err);
          });
      };

      // Start reading the file
      reader.readAsDataURL(file);
    });
  }

  downloadImage(): void {
    if (!this.resizedImageURL) return;

    const a = document.createElement('a');
    a.href = this.resizedImageURL;
    a.download = 'resized-image.jpg';
    a.click();
  }
}
