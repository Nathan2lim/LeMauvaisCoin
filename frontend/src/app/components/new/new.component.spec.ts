import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NewComponent } from './new.component';

describe('NewComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;
  let fileDropZone: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fileDropZone = fixture.nativeElement.querySelector('.file-drop-zone');

  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should throw an error if the title is empty', () => {
    component.titleControl.setValue('');
    component.titleControl.markAsTouched();
    fixture.detectChanges();

    const errors = component.getAllErrors();
    expect(errors).toContain('Le titre est requis.');
  });

  it('should throw an error if the title is too short', () => {
    component.titleControl.setValue('ab');
    component.titleControl.markAsTouched();
    fixture.detectChanges();

    const errors = component.getAllErrors();
    expect(errors).toContain('Le titre doit comporter au moins 3 caractères.');
  });

  it('should throw an error if the price is negative', () => {
    component.priceControl.setValue("-10");
    component.priceControl.markAsTouched();
    fixture.detectChanges();

    const errors = component.getAllErrors();
    expect(errors).toContain('Le prix doit être supérieur ou égal à 0.');
  });

  it('should validate the form when all fields are correct', () => {
    component.titleControl.setValue('Annonce valide');
    component.categoryControl.setValue('1');
    component.imageControl.setValue('image.jpg');
    component.locationControl.setValue('Paris');
    component.priceControl.setValue("100");
    component.descriptionControl.setValue('Description valide');
    fixture.detectChanges();

    expect(component.isFormValid).toBeTrue();
  });

    it('should set isDragOver to true on dragover event', () => {
    const dragEvent = new DragEvent('dragover');
    fileDropZone.dispatchEvent(dragEvent);

    expect(component.isDragOver).toBeTrue();
  });

  it('should set isDragOver to false on dragleave event', () => {
    const dragEvent = new DragEvent('dragleave');
    fileDropZone.dispatchEvent(dragEvent);

    expect(component.isDragOver).toBeFalse();
  });
});