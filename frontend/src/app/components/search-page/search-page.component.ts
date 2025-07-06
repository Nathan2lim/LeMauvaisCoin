import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  searchResults: any[] = [];
  searchQuery: string = '';

  ngOnInit() {

    const urlParams = new URLSearchParams(window.location.search);
    this.searchQuery = urlParams.get('q') || '';

    if (this.searchQuery) {
      this.apiService.getSearchResults(this.searchQuery).subscribe({
        next: (data) => {
          this.searchResults = data.items || [];
          if (data.total === 0) {
            console.warn('No results found for the search query:', this.searchQuery);
          }
          console.log('Search results:', this.searchResults);
        },
        error: (error) => {
          console.error('Error fetching search results:', error);
        }
      });
    } else {
      console.warn('No search query provided.');
    }
    
  }

  toggleFavorite(adId: number): void {
    // TODO: Implement favorite functionality
    console.log('Toggle favorite for ad:', adId);
    // This is a placeholder for future implementation
    // You would typically call an API service to add/remove from favorites
  }
}
