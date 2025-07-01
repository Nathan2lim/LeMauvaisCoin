import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit, OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  
  otpDigits: string[] = ['', '', '', ''];
  timeLeft: number;
  timerInterval: any;
  showRegenerateButton: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer(): void {
    this.timeLeft = 90; // 1 minute 30 seconds
    this.showRegenerateButton = false;
    
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.showRegenerateButton = true;
      }
    }, 1000);
  }

  onDigitInput(event: any, index: number): void {
    const value = event.target.value;

    // Only allow single digit
    if (value.length > 1) {
      event.target.value = value.slice(-1);
    }

    // Update the otpDigits array only if the value has changed
    if (this.otpDigits[index] !== event.target.value) {
      this.otpDigits[index] = event.target.value;
    }

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    // Handle backspace
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      if (prevInput) {
        prevInput.nativeElement.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 4).split('');
    
    digits.forEach((digit, index) => {
      if (index < 4) {
        this.otpDigits[index] = digit;
        const input = this.otpInputs.toArray()[index];
        if (input) {
          input.nativeElement.value = digit;
        }
      }
    });
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = this.otpDigits.findIndex(digit => digit === '');
    const targetIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 3;
    const targetInput = this.otpInputs.toArray()[targetIndex];
    if (targetInput) {
      targetInput.nativeElement.focus();
    }
    
    // Remove auto-validation after paste
  }

  // New method to check if OTP is complete
  isOtpComplete(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }

  // New method to validate OTP on button click
  onValidateOtp(): void {
    if (this.isOtpComplete()) {
      this.verifyOtp();
    }
  }

  verifyOtp(): void {
    this.isLoading = true;
    const otpCode = this.otpDigits.join('');
    
    // Simulate API call
    setTimeout(() => {
      // Here you would normally call your API service
      console.log('Verifying OTP:', otpCode);
      
      // Simulate success/failure
      if (otpCode === '1234') { // Example valid code
        this.router.navigate(['/home']);
      } else {
        this.showError('Code OTP invalide');
        this.clearOtp();
      }
      this.isLoading = false;
    }, 1000);
  }

  regenerateOtp(): void {
    this.isLoading = true;
    
    // Simulate API call to regenerate OTP
    setTimeout(() => {
      console.log('Regenerating OTP...');
      this.clearOtp();
      this.startTimer();
      this.isLoading = false;
    }, 1000);
  }

  clearOtp(): void {
    this.otpDigits = ['', '', '', ''];
    this.otpInputs.forEach((input, index) => {
      input.nativeElement.value = '';
    });
    
    // Focus first input
    if (this.otpInputs.first) {
      this.otpInputs.first.nativeElement.focus();
    }
  }

  showError(message: string): void {
    // You can implement a toast notification or error display here
    alert(message);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  goBack(): void {
    this.router.navigate(['/register']);
  }
}