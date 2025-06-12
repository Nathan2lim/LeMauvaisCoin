import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-listings',
  template: `
    <div class="listings-container">
      <div class="listings-header">
        <h2>Annonces Récentes</h2>
        <div class="header-actions">
          <div class="filter-bar">
            <select class="filter-select">
              <option value="">Toutes les catégories</option>
              <option value="vehicules">Véhicules</option>
              <option value="immobilier">Immobilier</option>
              <option value="multimedia">Multimédia</option>
              <option value="maison">Maison</option>
              <option value="loisirs">Loisirs</option>
            </select>
            <select class="filter-select">
              <option value="">Prix: Tous</option>
              <option value="price_asc">Prix: Croissant</option>
              <option value="price_desc">Prix: Décroissant</option>
              <option value="date_desc">Date: Plus récentes</option>
              <option value="date_asc">Date: Plus anciennes</option>
            </select>
          </div>
          <button class="create-button" (click)="navigateToCreate()">
            + Déposer une annonce
          </button>
        </div>
      </div>
      
      <div *ngIf="loading" class="loader">
        <div class="spinner"></div>
        <p>Chargement des annonces...</p>
      </div>
      
      <div *ngIf="error" class="error-message">
        <div class="error-icon">⚠</div>
        <div>
          <h3>Désolé, nous avons rencontré une erreur</h3>
          <p>Une erreur s'est produite lors du chargement des annonces.</p>
          <button class="retry-button" (click)="loadListings()">Réessayer</button>
        </div>
      </div>
      
      <div class="listings-grid" *ngIf="!loading && !error">
        <div *ngFor="let listing of listings" class="listing-card" (click)="viewListing(listing.id)">
          <div class="listing-image">
            <div class="placeholder-image">{{ listing.title[0] }}</div>
          </div>
          <div class="listing-content">
            <h3>{{ listing.title }}</h3>
            <p class="description">{{ listing.description }}</p>
            <div class="listing-footer">
              <p class="price">{{ listing.price }}€</p>
              <p class="date">{{ formatDate(listing.created_at) }}</p>
            </div>
            <button class="contact-button" (click)="contactSeller($event, listing)">Contacter le vendeur</button>
          </div>
        </div>
        
        <div *ngIf="listings && listings.length === 0" class="no-listings">
          <div class="no-listings-icon">📭</div>
          <h3>Pas encore d'annonces</h3>
          <p>Revenez bientôt pour découvrir de nouvelles annonces!</p>
        </div>
      </div>
      
      <div class="pagination" *ngIf="listings && listings.length > 0">
        <button class="pagination-button" [disabled]="currentPage === 1">Précédent</button>
        <div class="pagination-number">Page {{ currentPage }}</div>
        <button class="pagination-button">Suivant</button>
      </div>
    </div>
  `,
  styles: [`
    .listings-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .listings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .listings-header h2 {
      color: #2c3e50;
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .filter-bar {
      display: flex;
      gap: 15px;
    }

    .create-button {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .create-button:hover {
      background: #c0392b;
      transform: translateY(-2px);
    }
    
    .filter-select {
      padding: 8px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      font-size: 14px;
    }
    
    .listings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 25px;
      margin-bottom: 30px;
    }
    
    .listing-card {
      border-radius: 8px;
      overflow: hidden;
      background-color: white;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .listing-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .listing-image {
      height: 180px;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .placeholder-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #e74c3c;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
    }
    
    .listing-content {
      padding: 20px;
    }
    
    .listing-content h3 {
      margin-top: 0;
      margin-bottom: 10px;
      color: #2c3e50;
      font-size: 18px;
    }
    
    .description {
      color: #7f8c8d;
      margin-bottom: 20px;
      font-size: 14px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .listing-footer {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-size: 14px;
    }
    
    .price {
      font-weight: bold;
      color: #e74c3c;
      font-size: 18px;
    }
    
    .date {
      color: #95a5a6;
    }
    
    .contact-button {
      width: 100%;
      padding: 10px;
      background-color: #2c3e50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .contact-button:hover {
      background-color: #1a252f;
    }
    
    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px 0;
    }
    
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: #e74c3c;
      animation: spin 1s linear infinite;
      margin-bottom: 15px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-message {
      display: flex;
      align-items: center;
      padding: 30px;
      background-color: #fdeeee;
      border-radius: 8px;
      color: #842029;
      margin: 30px 0;
    }
    
    .error-icon {
      font-size: 24px;
      margin-right: 20px;
    }
    
    .error-message h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .error-message p {
      margin-top: 0;
      margin-bottom: 15px;
    }
    
    .retry-button {
      padding: 8px 15px;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .retry-button:hover {
      background-color: #c0392b;
    }
    
    .no-listings {
      grid-column: 1 / -1;
      text-align: center;
      padding: 50px 0;
    }
    
    .no-listings-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    
    .no-listings h3 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .no-listings p {
      color: #7f8c8d;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 30px;
    }
    
    .pagination-button {
      padding: 8px 15px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .pagination-button:hover {
      background-color: #e9e9e9;
    }
    
    .pagination-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .pagination-number {
      margin: 0 15px;
      color: #7f8c8d;
    }
  `]
})
export class ListingsComponent implements OnInit {
  listings: any[] = [];
  loading: boolean = true;
  error: boolean = false;
  currentPage: number = 1;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.loading = true;
    this.error = false;
    
    this.apiService.getListings().subscribe(
      (data: any) => {
        this.listings = data || [];
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching listings:', error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  viewListing(listingId: string): void {
    this.router.navigate(['/listing', listingId]);
  }

  contactSeller(event: Event, listing: any): void {
    event.stopPropagation(); // Prevent navigation when clicking the contact button
    alert(`Contacter le vendeur pour: ${listing.title}`);
  }

  navigateToCreate(): void {
    this.router.navigate(['/create']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
