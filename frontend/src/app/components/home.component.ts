import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1>Bienvenue sur LeMauvaisCoin</h1>
        <p>Votre plateforme de petites annonces de confiance</p>
        <div class="hero-actions">
          <button class="cta-button primary" (click)="navigateToListings()">
            Parcourir les annonces
          </button>
          <button class="cta-button secondary" (click)="navigateToCreate()">
            Déposer une annonce
          </button>
        </div>
      </div>

      <div class="stats-section">
        <div class="stat-item">
          <h3>500+</h3>
          <p>Annonces actives</p>
        </div>
        <div class="stat-item">
          <h3>1000+</h3>
          <p>Utilisateurs satisfaits</p>
        </div>
        <div class="stat-item">
          <h3>24h/24</h3>
          <p>Service disponible</p>
        </div>
      </div>

      <div class="features-section">
        <h2>Pourquoi choisir LeMauvaisCoin ?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Recherche facile</h3>
            <p>Trouvez rapidement ce que vous cherchez grâce à nos filtres avancés</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Prix attractifs</h3>
            <p>Des bonnes affaires tous les jours avec des prix négociables</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Sécurisé</h3>
            <p>Transactions sécurisées et vérification des utilisateurs</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Simple d'usage</h3>
            <p>Interface intuitive et dépôt d'annonce en quelques clics</p>
          </div>
        </div>
      </div>

      <div class="api-status" *ngIf="apiStatus">
        <div class="status-card success">
          <h3>{{ apiStatus.message }}</h3>
          <p>Statut: <span class="status">{{ apiStatus.status }}</span></p>
          <p class="timestamp">{{ apiStatus.timestamp }}</p>
        </div>
      </div>

      <div class="api-status" *ngIf="apiError">
        <div class="status-card error">
          <h3>Service temporairement indisponible</h3>
          <p>Nous travaillons pour rétablir la connexion au plus vite.</p>
          <button class="retry-button" (click)="checkApiStatus()">Réessayer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .hero-section {
      text-align: center;
      padding: 60px 0;
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
      border-radius: 15px;
      margin-bottom: 50px;
    }

    .hero-section h1 {
      font-size: 3.5em;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .hero-section p {
      font-size: 1.3em;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-button {
      padding: 15px 30px;
      border: none;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }

    .cta-button.primary {
      background: white;
      color: #e74c3c;
    }

    .cta-button.primary:hover {
      background: #f8f9fa;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .cta-button.secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .cta-button.secondary:hover {
      background: white;
      color: #e74c3c;
      transform: translateY(-2px);
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
      text-align: center;
    }

    .stat-item h3 {
      font-size: 2.5em;
      color: #e74c3c;
      margin-bottom: 10px;
    }

    .stat-item p {
      color: #7f8c8d;
      font-size: 1.1em;
    }

    .features-section {
      margin-bottom: 50px;
    }

    .features-section h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 40px;
      font-size: 2.5em;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }

    .feature-card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 3em;
      margin-bottom: 20px;
    }

    .feature-card h3 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    .feature-card p {
      color: #7f8c8d;
      line-height: 1.6;
    }

    .api-status {
      margin-top: 40px;
    }

    .status-card {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }

    .status-card.success {
      background-color: #e7f9f4;
      border-left: 4px solid #2ecc71;
      color: #27ae60;
    }

    .status-card.error {
      background-color: #fdeeee;
      border-left: 4px solid #e74c3c;
      color: #c0392b;
    }

    .status {
      display: inline-block;
      padding: 3px 8px;
      background-color: #2ecc71;
      color: white;
      border-radius: 12px;
      font-size: 0.8em;
    }

    .timestamp {
      font-size: 0.8em;
      opacity: 0.8;
    }

    .retry-button {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
    }

    .retry-button:hover {
      background: #c0392b;
    }

    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2.5em;
      }
      
      .hero-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .cta-button {
        width: 250px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  apiStatus: any = null;
  apiError: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.checkApiStatus();
  }

  navigateToListings(): void {
    this.router.navigate(['/listings']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/create']);
  }

  checkApiStatus(): void {
    this.apiService.getApiStatus().subscribe(
      (data: any) => {
        this.apiStatus = data;
        this.apiError = false;
      },
      (error: any) => {
        console.error('API connection error:', error);
        this.apiError = true;
      }
    );
  }
}
