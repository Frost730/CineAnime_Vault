/**
 * Image processing and compression utility for custom device uploads.
 * Downscales images to poster proportions (max 600x900) and compresses to WebP/JPEG,
 * ensuring high visual fidelity while keeping file sizes between ~30KB and ~70KB
 * to preserve localStorage quota.
 */

export interface ProcessedImage {
  dataUrl: string;
  sizeKb: number;
}

export async function processImageFile(
  file: File,
  maxWidth = 600,
  maxHeight = 900
): Promise<ProcessedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (PNG, JPG, WebP, etc.).');
  }

  // Prevent processing absurdly large files (>25MB)
  if (file.size > 25 * 1024 * 1024) {
    throw new Error('Image file is too large (max 25 MB). Please choose a smaller image.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file from device.'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to decode image data.'));
      };

      img.onload = () => {
        let { width, height } = img;

        // Proportional scale down if dimensions exceed bounds
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas rendering context is not available.'));
          return;
        }

        // Apply high-quality bicubic smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Attempt modern WebP export with quality 0.82
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', 0.82);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = '';
          }
        } catch {
          dataUrl = '';
        }

        // Fallback to JPEG if WebP export is unsupported or empty
        if (!dataUrl) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.84);
        }

        // Calculate approximate size in KB (base64 length * 0.75 / 1024)
        const approxBytes = Math.round((dataUrl.length * 3) / 4);
        const sizeKb = Math.round((approxBytes / 1024) * 10) / 10;

        resolve({ dataUrl, sizeKb });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
