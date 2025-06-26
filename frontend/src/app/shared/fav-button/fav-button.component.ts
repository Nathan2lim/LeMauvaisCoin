import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fav-button',
  templateUrl: './fav-button.component.html',
  styleUrls: ['./fav-button.component.css']
})
export class FavButtonComponent {
  @Input() isFavorite: boolean = false;;
  @Output() favoriteChanged = new EventEmitter<boolean>();
  isClicked: boolean = false;

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.favoriteChanged.emit(this.isFavorite);
    
    // Add click animation
    this.isClicked = true;
    setTimeout(() => {
      this.isClicked = false;
    }, 300);
  }
}
