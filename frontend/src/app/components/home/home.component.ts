import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentSlide = 0;
  slideWidth = 200; // largeur d'une slide (180px) + gap (20px)
  totalSlides = 5; // nombre total de slides
  visibleSlides = 4; // nombre de slides visibles à la fois

  nextSlide() {
    if (this.currentSlide < this.totalSlides - this.visibleSlides) {
      this.currentSlide++;
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  // Méthode pour vérifier si le bouton précédent doit être désactivé
  isPrevDisabled(): boolean {
    return this.currentSlide === 0;
  }

  // Méthode pour vérifier si le bouton suivant doit être désactivé
  isNextDisabled(): boolean {
    return this.currentSlide >= this.totalSlides - this.visibleSlides;
  }
}
