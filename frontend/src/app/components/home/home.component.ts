import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Carousel catégories
  currentSlide = 0;
  slideWidth = 200; // largeur d'une slide (180px) + gap (20px)
  totalSlides = 5; // nombre total de slides
  visibleSlides = 4; // nombre de slides visibles à la fois

  // Carousel "now" section
  currentNowSlide = 0;
  nowSlideWidth = 190; // largeur d'une slide (170px) + gap (20px)
  totalNowSlides = 12; // nombre total de slides
  visibleNowSlides = 5; // nombre de slides visibles à la fois

  // Méthodes pour le carousel catégories
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

  isPrevDisabled(): boolean {
    return this.currentSlide === 0;
  }

  isNextDisabled(): boolean {
    return this.currentSlide >= this.totalSlides - this.visibleSlides;
  }

  // Méthodes pour le carousel "now"
  nextNowSlide() {
    if (this.currentNowSlide < this.totalNowSlides - this.visibleNowSlides) {
      this.currentNowSlide++;
    }
  }

  previousNowSlide() {
    if (this.currentNowSlide > 0) {
      this.currentNowSlide--;
    }
  }

  isNowPrevDisabled(): boolean {
    return this.currentNowSlide === 0;
  }

  isNowNextDisabled(): boolean {
    return this.currentNowSlide >= this.totalNowSlides - this.visibleNowSlides;
  }
}
