import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ToolLayoutComponent } from '../shared/tool-layout.component';

@Component({
  selector: 'app-image-size-converter',
  standalone: true,
  imports: [
    ToolLayoutComponent, // ✅ Using layout component
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './image-size-converter.component.html',
  styleUrls: ['./image-size-converter.component.scss'],
})
export class ImageSizeConverterComponent {
  originalImages: File[] = [];
  resizedImages: { url: string; name: string }[] = [];
  targetSizeKB: number = 100;
  loading = false;

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    this.originalImages = [];

    if (files.length > 10) {
      alert('You can upload up to 10 images at a time.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        this.originalImages.push(files[i]);
      } else {
        alert(`Invalid file type: ${files[i].name}. Please select an image.`);
      }
    }
  }

  async resizeImages(): Promise<void> {
    if (this.originalImages.length === 0) {
      alert('Please upload at least one image.');
      return;
    }

    this.loading = true;
    this.resizedImages = [];

    for (const image of this.originalImages) {
      try {
        const resizedBlob = await this.compressImage(image, this.targetSizeKB);
        const resizedURL = URL.createObjectURL(resizedBlob);
        this.resizedImages.push({ url: resizedURL, name: image.name });
      } catch (error) {
        console.error('Image resizing error:', error);
        alert(`Error resizing ${image.name}.`);
      }
    }

    this.loading = false;
  }

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

        const getBlob = (width: number, height: number, quality: number): Promise<Blob> => {
          return new Promise((res, rej) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return rej('Canvas 2D context not available.');

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob) return rej('Failed to create blob from canvas.');
                res(blob);
              },
              'image/jpeg',
              quality
            );
          });
        };

        const getSizeKB = (blob: Blob): number => blob.size / 1024;

        getBlob(originalWidth, originalHeight, 1.0)
          .then(async (originalBlob) => {
            const originalSizeKB = getSizeKB(originalBlob);
            if (Math.abs(originalSizeKB - targetSizeKB) < 5) {
              return resolve(originalBlob);
            }

            const needShrink = originalSizeKB > targetSizeKB;
            let minScale = 0.05;
            let maxScale = 4.0;
            let bestBlob = originalBlob;
            let bestDiff = Math.abs(originalSizeKB - targetSizeKB);

            for (let i = 0; i < 7; i++) {
              const midScale = (minScale + maxScale) / 2;
              const scaledW = Math.max(1, Math.floor(originalWidth * midScale));
              const scaledH = Math.max(1, Math.floor(originalHeight * midScale));

              const testBlob = await getBlob(scaledW, scaledH, 1.0);
              const testSizeKB = getSizeKB(testBlob);
              const diff = Math.abs(testSizeKB - targetSizeKB);

              if (diff < bestDiff) {
                bestDiff = diff;
                bestBlob = testBlob;
              }

              if (needShrink) {
                if (testSizeKB > targetSizeKB) maxScale = midScale;
                else minScale = midScale;
              } else {
                if (testSizeKB < targetSizeKB) minScale = midScale;
                else maxScale = midScale;
              }
            }

            return resolve(bestBlob);
          })
          .catch((err) => reject(err));
      };

      reader.readAsDataURL(file);
    });
  }
  resetAll(): void {
    this.originalImages = [];
    this.resizedImages = [];
    this.targetSizeKB = 100; // Reset to default size
    this.loading = false;
  }
  
  downloadImage(url: string, filename: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = `resized-${filename}`;
    a.click();
  }
}
