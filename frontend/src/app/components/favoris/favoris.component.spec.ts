import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorisComponent } from './favoris.component';

describe('FavorisComponent', () => {
  let component: FavorisComponent;
  let fixture: ComponentFixture<FavorisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavorisComponent]
    });
    fixture = TestBed.createComponent(FavorisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove item from favorites when unfavorited', () => {
    const initialLength = component.favorites.length;
    const itemId = component.favorites[0].id;
    component.onFavoriteChanged(itemId, false);
    expect(component.favorites.length).toBe(initialLength - 1);
    expect(component.favorites.find(f => f.id === itemId)).toBeUndefined();
  });

  it('should not remove item if still favorite', () => {
    const initialLength = component.favorites.length;
    const itemId = component.favorites[0].id;
    component.onFavoriteChanged(itemId, true);
    expect(component.favorites.length).toBe(initialLength);
    expect(component.favorites.find(f => f.id === itemId)).toBeDefined();
  });
});
