import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit, OnDestroy {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  finalOtp: string;
  @ViewChild('otpInput1') otpInput1;
  @ViewChild('otpInput2') otpInput2;
  @ViewChild('otpInput3') otpInput3;
  @ViewChild('otpInput4') otpInput4;
  isLoading: boolean = false;
  isOtpComplete: boolean = false;
  showRegenerateButton: boolean = false;
  timeLeft: number = 90; // 1 minute 30 in seconds
  timerInterval: any;
  showError: boolean = false;
  error: string = '';
  dataPaste: string = '';
  email: string | null = null;
  password: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) {}

    ngOnInit(): void {
    this.startTimer();
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || null;
      this.password = params['password'] || null;
    });
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

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  regenerateOtp(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      console.log('Regenerating OTP...');
      this.clearOtp();
      this.startTimer();
      this.isLoading = false;
    }, 1000);
  }

    clearOtp(): void {
    this.otp1 = '';
    this.otp2 = '';
    this.otp3 = '';
    this.otp4 = '';
    this.isOtpComplete = false;
    this.showError = false;
    this.otpInput1.nativeElement.focus();
  }

  onPaste(event: ClipboardEvent) {
    this.dataPaste = event.clipboardData.getData('text');
    console.log('Pasted data:', this.dataPaste);

    if (/^\d{4}$/.test(this.dataPaste)) {
      this.otp1 = this.dataPaste[0];
      this.otp2 = this.dataPaste[1];
      this.otp3 = this.dataPaste[2];
      this.otp4 = this.dataPaste[3];
      this.isOtpComplete = true;
      this.otpInput4.nativeElement.focus();
      this.finalOtp = this.dataPaste;
    } else {
      this.showError = true;
      this.error = 'Le code OTP doit être un code à 4 chiffres.';
    }

  }

  onOTP1Change() {
    console.log("otp1", this.otp1)
    if (this.otp1 === '') {
      this.isOtpComplete = false;
    } else {
      this.otpInput2.nativeElement.focus();
      this.checkIfOtpComplete();
    }
  }

  onOTP2Change() {
    console.log(this.otp2);
    if (this.otp2 === '') {
      this.otpInput1.nativeElement.focus();
      this.isOtpComplete = false;
    } else {
      this.otpInput3.nativeElement.focus();
      this.checkIfOtpComplete();
    }
  }

  onOTP3Change() {
    if(this.otp3 === '') {
      this.otpInput2.nativeElement.focus();
      this.isOtpComplete = false;
    } else {
      this.otpInput4.nativeElement.focus();
      this.checkIfOtpComplete();
    }
  }

  onOTP4Change() {
    if(this.otp4 === '') {
      this.otpInput3.nativeElement.focus();
      this.isOtpComplete = false;
    } else {
      this.checkIfOtpComplete();
    }
  }

  checkIfOtpComplete() {
    if (this.otp1 && this.otp2 && this.otp3 && this.otp4) {
      this.isOtpComplete = true;
    } else {
      this.isOtpComplete = false;
    }
  }

  onValidateOtp() {
    if (this.isOtpComplete) {
      this.isLoading = true;
      this.finalOtp = this.otp1 + this.otp2 + this.otp3 + this.otp4;
      console.log('Validating OTP:', this.finalOtp);

      if (this.finalOtp === '1234') { // Example condition for successful OTP validation
        this.apiService.login(this.email!, this.password!).subscribe({
          next: (response) => {
          console.log('Login successful:', response);
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
          }
          this.showError = false;
          this.isLoading = false;
          this.router.navigate(['/home']);
        },
          error: (error) => {
          console.error('Login failed:', error);
          this.isLoading = false;
          this.showError = true;
          this.error = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
        }
        });
      } else {
          this.isLoading = false;
          this.showError = true;
          this.error = 'Le code OTP est incorrect. Veuillez réessayer.';

      }
    }
  }

  goBack() {
    this.router.navigate(['/register']);
  }
}