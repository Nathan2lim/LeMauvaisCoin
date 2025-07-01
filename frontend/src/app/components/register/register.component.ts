import { Component } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  usernameControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
  passwordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(26),
    this.passwordStrengthValidator
  ]);
  confirmPasswordControl = new FormControl('', [Validators.required, this.passwordMatchValidator.bind(this)]);

  // Track which fields have been touched/focused
  touchedFields: Set<string> = new Set();
  submitAttempted: boolean = false;
  apiError: string = '';

  ngOnInit(): void {
    this.emailControl.valueChanges.subscribe(() => {
      this.touchedFields.add('email');
    });

    this.usernameControl.valueChanges.subscribe(() => {
      this.touchedFields.add('username');
    });

    this.passwordControl.valueChanges.subscribe(() => {
      this.touchedFields.add('password');
      // Re-validate confirm password when password changes
      this.confirmPasswordControl.updateValueAndValidity();
    });

    this.confirmPasswordControl.valueChanges.subscribe(() => {
      this.touchedFields.add('confirmPassword');
    });
  }

  // Custom password strength validator
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null; // Let required validator handle empty values
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const valid = hasUpperCase && hasNumber && hasSpecialChar;

    if (!valid) {
      return { passwordStrength: true };
    }

    return null;
  }

  // Custom password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }
    
    const passwordValue = this.passwordControl?.value;
    if (control.value !== passwordValue) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // Get specific error message for email field
  getEmailError(): string {
    if (!this.shouldShowError('email')) return '';
    
    if (this.emailControl.hasError('required')) {
      return "L'email est requis.";
    }
    if (this.emailControl.hasError('email')) {
      return 'Veuillez entrer un email valide.';
    }
    return '';
  }

  // Get specific error message for username field
  getUsernameError(): string {
    if (!this.shouldShowError('username')) return '';
    
    if (this.usernameControl.hasError('required')) {
      return 'Le nom d\'utilisateur est requis.';
    }
    if (this.usernameControl.hasError('minlength')) {
      return 'Le nom d\'utilisateur doit comporter au moins 3 caractères.';
    }
    if (this.usernameControl.hasError('maxlength')) {
      return 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères.';
    }
    return '';
  }

  // Get specific error message for password field
  getPasswordError(): string {
    if (!this.shouldShowError('password')) return '';
    
    if (this.passwordControl.hasError('required')) {
      return 'Le mot de passe est requis.';
    }
    if (this.passwordControl.hasError('minlength')) {
      return 'Le mot de passe doit comporter au moins 8 caractères.';
    }
    if (this.passwordControl.hasError('maxlength')) {
      return 'Le mot de passe ne peut pas dépasser 26 caractères.';
    }
    if (this.passwordControl.hasError('passwordStrength')) {
      return 'Le mot de passe doit contenir au moins 1 majuscule, 1 chiffre et 1 caractère spécial.';
    }
    return '';
  }

  // Get specific error message for confirm password field
  getConfirmPasswordError(): string {
    if (!this.shouldShowError('confirmPassword')) return '';
    
    if (this.confirmPasswordControl.hasError('required')) {
      return 'La confirmation du mot de passe est requise.';
    }
    if (this.confirmPasswordControl.hasError('passwordMismatch')) {
      return 'Les mots de passe ne correspondent pas.';
    }
    return '';
  }

  // Get all error messages for the error component
  getAllErrors(): string {
    const errors: string[] = [];
    
    const emailError = this.getEmailError();
    const usernameError = this.getUsernameError();
    const passwordError = this.getPasswordError();
    const confirmPasswordError = this.getConfirmPasswordError();
    
    if (emailError) errors.push(emailError);
    if (usernameError) errors.push(usernameError);
    if (passwordError) errors.push(passwordError);
    if (confirmPasswordError) errors.push(confirmPasswordError);
    if (this.apiError) errors.push(this.apiError);
    
    return errors.join('\n');
  }

  // Check if error should be shown for a field
  shouldShowError(fieldName: string): boolean {
    const control = fieldName === 'email' ? this.emailControl :
                    fieldName === 'username' ? this.usernameControl :
                    fieldName === 'password' ? this.passwordControl :
                    this.confirmPasswordControl;
    return control.invalid && (this.touchedFields.has(fieldName) || this.submitAttempted);
  }

  // Check if field should have error class
  hasFieldError(fieldName: string): boolean {
    return this.shouldShowError(fieldName);
  }

  // Check if form is valid
  get isFormValid(): boolean {
    return this.emailControl.valid && this.usernameControl.valid && 
           this.passwordControl.valid && this.confirmPasswordControl.valid &&
           this.confirmPasswordControl.value === this.passwordControl.value;
  }

  // Handle form submission
  onSubmit(event: Event): void {
    event?.preventDefault(); // Prevent default form submission behavior
    this.submitAttempted = true;
    this.apiError = ''; // Reset API error

    // Mark all fields as touched to show validation errors
    this.touchedFields.add('email');
    this.touchedFields.add('username');
    this.touchedFields.add('password');
    this.touchedFields.add('confirmPassword');

    if (!this.isFormValid) {
      console.log('Form is invalid');
      return; // Don't submit if form is invalid
    }

    if (this.isFormValid) {
      console.log('Form submitted successfully');
    }
  }

}
