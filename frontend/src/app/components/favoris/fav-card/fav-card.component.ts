import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface FavoriteItem {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  city: string;
  date: string;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-fav-card',
  templateUrl: './fav-card.component.html',
  styleUrls: ['./fav-card.component.css']
})
export class FavCardComponent {
  @Input() favorite!: FavoriteItem;
  @Output() favoriteChanged = new EventEmitter<boolean>();

  // Default values in case no data is provided
  get displayTitle(): string {
    return this.favorite?.title || 'Favorite Item Title';
  }

  get displayPrice(): string {
    return this.favorite?.price ? `${this.favorite.price} €` : '5 €';
  }

  get displayImageUrl(): string {
    return this.favorite?.imageUrl || 'https://placehold.co/220x200';
  }

  get displayCategory(): string {
    return this.favorite?.category || 'Ammeublement';
  }

  get displayCity(): string {
    return this.favorite?.city || 'Chessy';
  }

  get displayDate(): string {
    return this.favorite?.date || 'Aujourd\'hui à 9h52';
  }

  get displayIsFavorite(): boolean {
    return this.favorite?.isFavorite ?? true;
  }

  onFavoriteToggle(isFavorite: boolean): void {
    this.favoriteChanged.emit(isFavorite);
  }
}
