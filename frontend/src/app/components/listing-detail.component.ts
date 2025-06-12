import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-listing-detail',
  template: `
    <div class="listing-detail-container">
      <button class="back-button" (click)="goBack()">
        ← Retour aux annonces
      </button>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement de l'annonce...</p>
      </div>

      <div *ngIf="error" class="error-message">
        <h2>Annonce non trouvée</h2>
        <p>L'annonce que vous recherchez n'existe pas ou a été supprimée.</p>
        <button class="btn-primary" (click)="goBack()">Retour aux annonces</button>
      </div>

      <div *ngIf="listing && !loading && !error" class="listing-content">
        <div class="listing-header">
          <h1>{{ listing.title }}</h1>
          <div class="listing-meta">
            <span class="category">{{ getCategoryName(listing.category) }}</span>
            <span class="date">Publié le {{ formatDate(listing.created_at) }}</span>
          </div>
        </div>

        <div class="listing-body">
          <div class="listing-main">
            <div class="image-section">
              <div class="main-image">
                <div class="placeholder-image">
                  {{ listing.title[0] }}
                </div>
              </div>
              <div class="image-thumbnails">
                <div class="thumbnail active">
                  <div class="thumbnail-placeholder">{{ listing.title[0] }}</div>
                </div>
                <!-- More thumbnails would go here -->
              </div>
            </div>

            <div class="description-section">
              <h2>Description</h2>
              <p class="description">{{ listing.description }}</p>

              <div class="details-grid">
                <div class="detail-item" *ngIf="listing.condition">
                  <span class="detail-label">État:</span>
                  <span class="detail-value">{{ getConditionName(listing.condition) }}</span>
                </div>
                <div class="detail-item" *ngIf="listing.location">
                  <span class="detail-label">Localisation:</span>
                  <span class="detail-value">{{ listing.location }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="listing-sidebar">
            <div class="price-card">
              <div class="price">{{ listing.price }}€</div>
              <div class="price-info">Prix négociable</div>
            </div>

            <div class="contact-card">
              <h3>Contacter le vendeur</h3>
              <div class="seller-info">
                <div class="seller-name">{{ listing.contact_name || 'Vendeur' }}</div>
                <div class="seller-rating">⭐⭐⭐⭐⭐ (4.8/5)</div>
              </div>
              
              <div class="contact-actions">
                <button class="btn-primary btn-full" (click)="contactSeller('phone')">
                  📞 Téléphoner
                </button>
                <button class="btn-secondary btn-full" (click)="contactSeller('email')">
                  ✉️ Envoyer un message
                </button>
              </div>

              <div class="safety-tips">
                <h4>💡 Conseils de sécurité</h4>
                <ul>
                  <li>Rencontrez le vendeur dans un lieu public</li>
                  <li>Vérifiez l'article avant l'achat</li>
                  <li>Ne payez jamais à l'avance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="actions-section">
          <button class="btn-secondary" (click)="shareListing()">
            🔗 Partager cette annonce
          </button>
          <button class="btn-outline" (click)="reportListing()">
            ⚠️ Signaler cette annonce
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .listing-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .back-button {
      background: none;
      border: none;
      color: #e74c3c;
      font-size: 16px;
      cursor: pointer;
      margin-bottom: 20px;
      padding: 10px 0;
    }

    .back-button:hover {
      text-decoration: underline;
    }

    .loading {
      text-align: center;
      padding: 50px 0;
    }

    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: #e74c3c;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      text-align: center;
      padding: 50px 0;
      color: #e74c3c;
    }

    .listing-header {
      margin-bottom: 30px;
    }

    .listing-header h1 {
      color: #2c3e50;
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    .listing-meta {
      display: flex;
      gap: 20px;
      color: #7f8c8d;
    }

    .category {
      background: #e74c3c;
      color: white;
      padding: 5px 12px;
      border-radius: 15px;
      font-size: 0.9em;
    }

    .listing-body {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 40px;
      margin-bottom: 30px;
    }

    .image-section {
      margin-bottom: 30px;
    }

    .main-image {
      margin-bottom: 15px;
    }

    .placeholder-image {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4em;
      font-weight: bold;
      height: 400px;
      border-radius: 10px;
    }

    .image-thumbnails {
      display: flex;
      gap: 10px;
    }

    .thumbnail {
      width: 80px;
      height: 80px;
      border-radius: 5px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
    }

    .thumbnail.active {
      border-color: #e74c3c;
    }

    .thumbnail-placeholder {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      height: 100%;
    }

    .description-section h2 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    .description {
      line-height: 1.6;
      color: #555;
      margin-bottom: 25px;
    }

    .details-grid {
      display: grid;
      gap: 15px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #ecf0f1;
    }

    .detail-label {
      font-weight: 500;
      color: #7f8c8d;
    }

    .detail-value {
      color: #2c3e50;
    }

    .listing-sidebar {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .price-card, .contact-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      padding: 25px;
    }

    .price {
      font-size: 2.5em;
      font-weight: bold;
      color: #e74c3c;
      margin-bottom: 5px;
    }

    .price-info {
      color: #7f8c8d;
      font-size: 0.9em;
    }

    .contact-card h3 {
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .seller-info {
      margin-bottom: 20px;
    }

    .seller-name {
      font-weight: 500;
      color: #2c3e50;
      margin-bottom: 5px;
    }

    .seller-rating {
      color: #f39c12;
      font-size: 0.9em;
    }

    .contact-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 25px;
    }

    .btn-primary, .btn-secondary, .btn-outline, .btn-full {
      padding: 12px 20px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
    }

    .btn-primary {
      background: #e74c3c;
      color: white;
    }

    .btn-primary:hover {
      background: #c0392b;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid #e74c3c;
      color: #e74c3c;
    }

    .btn-outline:hover {
      background: #e74c3c;
      color: white;
    }

    .btn-full {
      width: 100%;
    }

    .safety-tips {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
    }

    .safety-tips h4 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 0.9em;
    }

    .safety-tips ul {
      margin: 0;
      padding-left: 20px;
      color: #7f8c8d;
      font-size: 0.85em;
    }

    .safety-tips li {
      margin-bottom: 5px;
    }

    .actions-section {
      display: flex;
      gap: 15px;
      justify-content: center;
      padding-top: 20px;
      border-top: 1px solid #ecf0f1;
    }

    @media (max-width: 768px) {
      .listing-body {
        grid-template-columns: 1fr;
      }
      
      .listing-sidebar {
        order: -1;
      }
      
      .actions-section {
        flex-direction: column;
      }
    }
  `]
})
export class ListingDetailComponent implements OnInit {
  listing: any = null;
  loading: boolean = true;
  error: boolean = false;
  listingId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.listingId = this.route.snapshot.paramMap.get('id') || '';
    this.loadListing();
  }

  loadListing(): void {
    this.loading = true;
    this.error = false;

    // For now, simulate loading a specific listing
    // In a real app, you would call: this.apiService.getListing(this.listingId)
    
    setTimeout(() => {
      // Simulate API response
      this.listing = {
        id: this.listingId,
        title: 'iPhone 12 Pro 128GB - État excellent',
        description: 'iPhone 12 Pro en parfait état, utilisé avec précaution. Écran sans rayure, batterie à 87% de capacité. Vendu avec chargeur, câble et coque de protection. Facture d\'achat disponible. Téléphone débloqué tous opérateurs.',
        price: 650,
        category: 'multimedia',
        condition: 'tres-bon',
        location: 'Paris 15ème',
        contact_name: 'Marie Dupont',
        created_at: '2025-06-10T10:30:00Z'
      };
      this.loading = false;
    }, 1000);
  }

  getCategoryName(category: string): string {
    const categories: { [key: string]: string } = {
      'vehicules': 'Véhicules',
      'immobilier': 'Immobilier',
      'multimedia': 'Multimédia',
      'maison': 'Maison & Jardin',
      'loisirs': 'Loisirs',
      'mode': 'Mode',
      'emploi': 'Emploi',
      'autres': 'Autres'
    };
    return categories[category] || category;
  }

  getConditionName(condition: string): string {
    const conditions: { [key: string]: string } = {
      'neuf': 'Neuf',
      'tres-bon': 'Très bon état',
      'bon': 'Bon état',
      'satisfaisant': 'État satisfaisant',
      'pour-pieces': 'Pour pièces'
    };
    return conditions[condition] || condition;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  contactSeller(method: string): void {
    if (method === 'phone') {
      alert('Fonctionnalité téléphone à implémenter');
    } else if (method === 'email') {
      alert('Fonctionnalité message à implémenter');
    }
  }

  shareListing(): void {
    if (navigator.share) {
      navigator.share({
        title: this.listing.title,
        text: this.listing.description,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier!');
    }
  }

  reportListing(): void {
    alert('Fonctionnalité de signalement à implémenter');
  }

  goBack(): void {
    this.router.navigate(['/listings']);
  }
}
