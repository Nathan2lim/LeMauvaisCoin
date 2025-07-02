import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should show error for short username', () => {
    component.usernameControl.setValue('ab');
    component.usernameControl.markAsTouched();
    fixture.detectChanges();
    expect(component.getUsernameError()).toContain('caractères');
  });

  it('should show error for weak password', () => {
    component.passwordControl.setValue('123');
    component.passwordControl.markAsTouched();
    fixture.detectChanges();
    expect(component.getPasswordError()).toContain('mot de passe');
  });

  it('should show error if passwords do not match', () => {
    component.passwordControl.setValue('Password123!');
    component.confirmPasswordControl.setValue('Different123!');
    component.confirmPasswordControl.markAsTouched();
    fixture.detectChanges();
    expect(component.getConfirmPasswordError()).toContain('correspondent');
  });
});
