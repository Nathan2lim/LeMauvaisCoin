import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

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
export class NewComponent implements OnInit {
  categories: { value: string; name: string }[] = [];

  titleControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  categoryControl = new FormControl('', [Validators.required]);
  imageControl = new FormControl('', [Validators.required]);
  locationControl = new FormControl('', [Validators.required]);
  priceControl = new FormControl('', [Validators.required, Validators.min(0), Validators.max(1000000), Validators.pattern('^[0-9]+$')]);
  descriptionControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]);

  selectedFiles: FileWithPreview[] = [];
  isDragOver = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getCategories().subscribe(
      (categories) => {
        this.categories = categories.member.map((category: any) => ({
          id: category.id,
          name: category.name
        }));
      },
      (error) => {
        console.error('Error fetching categories:', error);
        // Handle error - maybe show a message to the user
      }
    );
  }

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
    console.log('Form Validity Check');
    console.log('Title Valid:', this.titleControl.valid);
    console.log('Category Valid:', this.categoryControl.valid);
    console.log('Category Valid:', this.categoryControl.value);
    console.log('Image Valid:', this.imageControl.valid);
    console.log('Location Valid:', this.locationControl.valid);
    console.log('Price Valid:', this.priceControl.valid);
    console.log('Description Valid:', this.descriptionControl.valid);
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
      const files = this.selectedFiles.map(fileWithPreview => fileWithPreview.file);
      
      this.apiService.setUserToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTE0NjMyNzMsImV4cCI6MTc1MTQ2Njg3Mywicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiZW1haWxAZW1haWwuY29tIn0.cKQG9Jdcp-JUFq3ocUdfc48VWdUC_rP5IGbPBQTChqrHXem5Uksz5Xzxcm6o7q1Oio6sCtos-GqYeAMJeEII1aNaKv3KS46SRx1b1nZAwjKbTN67WkkOHNklYwVz7JF93l6KfxVZh7b0Nrf2A4eEaypFVsQKRyBdzeiPN1DwJhWxawQ2LER6doPtfMsj_aGZwY7qhQVunWbDkOrUOtlEIJz_PGV-3CXHsCrfVQq4lfLYt2FJJS-P8XzzRXw2wsojfJ8x1oTr35w46wTkz_sUvBF7Bc-gDq9gaCkGJ41xu6UfOu5a4YF1sfiNGA4SQM02pD-VXHgnLoQfx4Klw2CYjr0skCbTL8YWJxz4d14-LqxUMLNrgEzmrDCjbRSbBjnZtyg9kLgGA9rZ7DyLLr047p0i3wrLksJz3_US8czdgM-ur0JiT4szBjKNHNejmlJEpNd7TjOq357PsLfewIYzTBzIUtrrQqdHZ_2duSMwq-fgOLNbzM6lgxZMdFzvX95uAuZjmZVRHNErijGixW3Wn6tRoRU8ITgmHmOBdmb875sHiHWm0rkI88w5-qLQTX2CZlbRE-G6VX6OGrBFHX-ySIi3_Gst0uc4BhZShovutjnCfMFgORrTNJDU8zHwJVpoMsGkelHx6zdgV4L8SSkOcSqkaj-Y5eIPNk2wmbbN_yA'); // Set the user token if needed
      this.apiService.postNewListing(
        {
          title: this.titleControl.value,
          category: this.categoryControl.value,
          location: this.locationControl.value,
          price: this.priceControl.value,
          description: this.descriptionControl.value
        },
        files
      ).subscribe(
        (response) => {
          console.log('API Response:', response);
          // Handle success - maybe redirect or show success message
          this.router.navigate(['/ads/' + response.id]); // Redirect to home after successful submission
        },
        (error) => {
          console.error('API Error:', error);
          // Handle error
        });
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
      this.imageControl.setValue('');
      this.imageControl.markAsTouched();
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    
    // Update form control
    if (this.selectedFiles.length > 0) {
      this.imageControl.setValue(`${this.selectedFiles.length} image(s) selected`);
    } else {
      this.imageControl.setValue('');
    }
    this.imageControl.markAsTouched();
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
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      this.imageControl.setValue('');
      this.imageControl.markAsTouched();
      return;
    }

    let processedCount = 0;
    
    validFiles.forEach(file => {
      // Create preview URL for images
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFiles.push({
          file: file,
          name: file.name,
          preview: e.target.result
        });
        
        processedCount++;
        
        // Update form control when all files are processed
        if (processedCount === validFiles.length) {
          this.imageControl.setValue(`${this.selectedFiles.length} image(s) selected`);
          this.imageControl.markAsTouched();
        }
      };
      reader.readAsDataURL(file);
    });
  }
}
