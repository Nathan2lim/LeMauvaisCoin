import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);
  
  // Track which fields have been touched/focused
  touchedFields: Set<string> = new Set();
  submitAttempted: boolean = false;
  apiError: string = '';

  ngOnInit() {
    this.emailControl.valueChanges.subscribe(() => {
      this.touchedFields.add('email');
    });

    this.passwordControl.valueChanges.subscribe(() => {
      this.touchedFields.add('password');
    });
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

  // Get specific error message for password field
  getPasswordError(): string {
    if (!this.shouldShowError('password')) return '';
    
    if (this.passwordControl.hasError('required')) {
      return 'Le mot de passe est requis.';
    }
    return '';
  }

  // Get all error messages for the error component
  getAllErrors(): string {
    const errors: string[] = [];
    
    const emailError = this.getEmailError();
    const passwordError = this.getPasswordError();
    
    if (emailError) errors.push(emailError);
    if (passwordError) errors.push(passwordError);
    if (this.apiError) errors.push(this.apiError);
    
    return errors.join('\n');
  }

  // Check if error should be shown for a field
  shouldShowError(fieldName: string): boolean {
    const control = fieldName === 'email' ? this.emailControl : this.passwordControl;
    return control.invalid && (this.touchedFields.has(fieldName) || this.submitAttempted);
  }

  // Check if field should have error class
  hasFieldError(fieldName: string): boolean {
    return this.shouldShowError(fieldName);
  }

  // Check if form is valid
  get isFormValid(): boolean {
    return this.emailControl.valid && this.passwordControl.valid;
  }

  onSubmit() {
    this.submitAttempted = true;
    this.apiError = ''; // Clear previous API errors
    
    // Mark all fields as touched when submit is attempted
    this.touchedFields.add('email');
    this.touchedFields.add('password');

    if (!this.isFormValid) {
      return; // Don't submit if form is invalid
    }

    const email = this.emailControl.value;
    const password = this.passwordControl.value;
    console.log('Login data:', { email, password });
    
    // TODO: Replace with actual API call
    // Simulate API error for demonstration
    if (email !== 'test@example.com' || password !== 'password') {
      this.apiError = 'Identifiants incorrects.';
    } else {
      console.log('Login successful!');
      // Handle successful login
    }
  }
}
