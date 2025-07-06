import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavButtonComponent } from './fav-button.component';
import { By } from '@angular/platform-browser';

describe('FavButtonComponent', () => {
  let component: FavButtonComponent;
  let fixture: ComponentFixture<FavButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavButtonComponent]
    });
    fixture = TestBed.createComponent(FavButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle favorite and emit event', () => {
    spyOn(component.favoriteChanged, 'emit');
    component.isFavorite = false;
    component.toggleFavorite();
    expect(component.isFavorite).toBeTrue();
    expect(component.favoriteChanged.emit).toHaveBeenCalledWith(true);
    component.toggleFavorite();
    expect(component.isFavorite).toBeFalse();
    expect(component.favoriteChanged.emit).toHaveBeenCalledWith(false);
  });

  it('should set isClicked to true on toggle and reset after timeout', (done) => {
    component.isClicked = false;
    component.toggleFavorite();
    expect(component.isClicked).toBeTrue();
    setTimeout(() => {
      expect(component.isClicked).toBeFalse();
      done();
    }, 350);
  });
});
