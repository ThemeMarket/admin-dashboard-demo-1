import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  toBase64(image: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject(new Error('Error converting image to Base64'));
        }
      };
      reader.onerror = reject;

      reader.readAsDataURL(image);
    });
  }
}
