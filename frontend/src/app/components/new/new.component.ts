import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

interface FileWithPreview {
  file: File;
  name: string;
  preview: string;
}

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {
  titleControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  categoryControl = new FormControl('', [Validators.required]);
  imageControl = new FormControl('', [Validators.required]);
  locationControl = new FormControl('', [Validators.required]);
  priceControl = new FormControl('', [Validators.required, Validators.min(0), Validators.max(1000000), Validators.pattern('^[0-9]+$')]);
  descriptionControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]);

  selectedFiles: FileWithPreview[] = [];
  isDragOver = false;

  categories = [
    { id: '1', name: 'Électronique' },
    { id: '2', name: 'Vêtements' },
    { id: '3', name: 'Meubles' },
    { id: '4', name: 'Jouets' },
    { id: '5', name: 'Livres' }
  ];

  getAllErrors(): string {
    const errors: string[] = [];

    if (this.titleControl.hasError('required') && this.titleControl.touched) {
      errors.push('Le titre est requis.');
    } else if (this.titleControl.hasError('minlength') && this.titleControl.touched) {
      errors.push('Le titre doit comporter au moins 3 caractères.');
    } else if (this.titleControl.hasError('maxlength') && this.titleControl.touched) {
      errors.push('Le titre ne peut pas dépasser 100 caractères.');
    }

    if (this.categoryControl.hasError('required') && this.categoryControl.touched) {
      errors.push('La catégorie est requise.');
    }

    if (this.imageControl.hasError('required') && this.imageControl.touched) {
      errors.push("L'image est requise.");
    }

    if (this.locationControl.hasError('required') && this.locationControl.touched) {
      errors.push('L\'emplacement est requis.');
    }

    if (this.priceControl.hasError('required') && this.priceControl.touched) {
      errors.push('Le prix est requis.');
    } else if (this.priceControl.hasError('min')) {
      errors.push('Le prix doit être supérieur ou égal à 0.');
    } else if (this.priceControl.hasError('max')) {
      errors.push('Le prix ne peut pas dépasser 1 000 000.');
    } else if (this.priceControl.hasError('pattern')) {
      errors.push('Le prix doit être un nombre entier positif.');
    }

    if (this.descriptionControl.hasError('required') && this.descriptionControl.touched) {
      errors.push('La description est requise.');
    } else if (this.descriptionControl.hasError('minlength')) {
      errors.push('La description doit comporter au moins 10 caractères.');
    } else if (this.descriptionControl.hasError('maxlength')) {
      errors.push('La description ne peut pas dépasser 500 caractères.');
    }

    return errors.join('\n');
  }

  get isFormValid(): boolean {
    return this.titleControl.valid &&
           this.categoryControl.valid &&
           this.imageControl.valid &&
           this.locationControl.valid &&
           this.priceControl.valid &&
           this.descriptionControl.valid;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.isFormValid) {
      // Handle form submission logic here
      console.log('Form submitted successfully!');
    } else {
      console.log('Form is invalid:', this.getAllErrors());
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(input.files);
    } else {
      this.selectedFiles = [];
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    // fileInput.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
  }

  private processFiles(files: FileList): void {
    this.selectedFiles = [];
    
    Array.from(files).forEach(file => {
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        // Create preview URL for images
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedFiles.push({
            file: file,
            name: file.name,
            preview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }
}
