import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavCardComponent, FavoriteItem } from './fav-card.component';
import { By } from '@angular/platform-browser';

describe('FavCardComponent', () => {
  let component: FavCardComponent;
  let fixture: ComponentFixture<FavCardComponent>;
  const mockFavorite: FavoriteItem = {
    id: 1,
    title: 'Test Title',
    price: 99,
    imageUrl: 'test.jpg',
    category: 'TestCat',
    city: 'TestCity',
    date: 'Today',
    isFavorite: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavCardComponent]
    });
    fixture = TestBed.createComponent(FavCardComponent);
    component = fixture.componentInstance;
    component.favorite = mockFavorite;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display favorite title', () => {
    expect(component.displayTitle).toBe('Test Title');
  });

  it('should emit favoriteChanged event', () => {
    spyOn(component.favoriteChanged, 'emit');
    component.onFavoriteToggle(false);
    expect(component.favoriteChanged.emit).toHaveBeenCalledWith(false);
  });

  it('should use default values if favorite is missing fields', () => {
    component.favorite = { id: 2, title: '', price: 0, imageUrl: '', category: '', city: '', date: '' };
    expect(component.displayTitle).toBe('Favorite Item Title');
    expect(component.displayPrice).toBe('5 €');
    expect(component.displayImageUrl).toContain('placehold');
    expect(component.displayCategory).toBe('Ammeublement');
    expect(component.displayCity).toBe('Chessy');
    expect(component.displayDate).toContain('Aujourd');
  });
});
