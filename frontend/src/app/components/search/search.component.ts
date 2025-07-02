import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

// Permettre l'accès à Math depuis le template
declare var Math: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  isLoading = false;
  results: any[] = [];
  totalResults = 0;
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    // Configuration de la recherche avec debounce pour éviter trop d'appels API
    this.searchControl.valueChanges.pipe(
      debounceTime(500), // Attendre 500ms après la dernière frappe
      distinctUntilChanged(), // Ignorer si la valeur n'a pas changé
      filter(term => term && term.length >= 2), // Au moins 2 caractères
      switchMap(term => {
        this.isLoading = true;
        return this.searchService.search(
          term, 
          this.itemsPerPage, 
          (this.currentPage - 1) * this.itemsPerPage
        );
      })
    ).subscribe({
      next: (response) => {
        this.results = response.items;
        this.totalResults = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Effectue une recherche explicite (appelée par le bouton de recherche)
   */
  search(): void {
    const term = this.searchControl.value;
    if (term && term.length >= 2) {
      this.isLoading = true;
      this.searchService.search(
        term,
        this.itemsPerPage,
        (this.currentPage - 1) * this.itemsPerPage
      ).subscribe({
        next: (response) => {
          this.results = response.items;
          this.totalResults = response.total;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche:', error);
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Change de page pour les résultats de recherche
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.search();
  }
}
