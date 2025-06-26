import { Component } from '@angular/core';
import { FavoriteItem } from './fav-card/fav-card.component';

@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.css']
})
export class FavorisComponent {
  favorites: FavoriteItem[] = [
    {
      id: 1,
      title: 'Canapé en cuir vintage',
      price: 250,
      imageUrl: 'https://placehold.co/220x200/8B4513/FFFFFF',
      category: 'Ameublement',
      city: 'Paris',
      date: 'Aujourd\'hui à 14h30',
      isFavorite: true
    },
    {
      id: 2,
      title: 'Vélo de course',
      price: 450,
      imageUrl: 'https://placehold.co/220x200/FF6B6B/FFFFFF',
      category: 'Sport',
      city: 'Lyon',
      date: 'Hier à 16h45',
      isFavorite: true
    },
    {
      id: 3,
      title: 'iPhone 13 Pro',
      price: 800,
      imageUrl: 'https://placehold.co/220x200/4ECDC4/FFFFFF',
      category: 'Téléphones',
      city: 'Marseille',
      date: 'Il y a 2 jours',
      isFavorite: true
    }
  ];

  onFavoriteChanged(itemId: number, isFavorite: boolean): void {
    const item = this.favorites.find(f => f.id === itemId);
    if (item) {
      item.isFavorite = isFavorite;
      
      // Remove from favorites list if unfavorited
      if (!isFavorite) {
        this.favorites = this.favorites.filter(f => f.id !== itemId);
      }
    }
  }
}
