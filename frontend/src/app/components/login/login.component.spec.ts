import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, , HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error for invalid email', () => {
    component.emailControl.setValue('invalid');
    component.emailControl.markAsTouched();
    fixture.detectChanges();
    expect(component.getEmailError()).toContain('Veuillez entrer un email valide.');
  });

  it('should show error for empty password', () => {
    component.passwordControl.setValue('');
    component.passwordControl.markAsTouched();
    fixture.detectChanges();
    expect(component.getPasswordError()).toContain('mot de passe');
  });

  it('should be invalid if email or password is missing', () => {
    component.emailControl.setValue('');
    component.passwordControl.setValue('');
    expect(component.isFormValid).toBeFalse();
  });
});
