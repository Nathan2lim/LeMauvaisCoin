import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="hello-container">
      <div class="hello-card">
        <h1>Hello World!</h1>
        <h2>Bienvenue sur LeMauvaisCoin</h2>
        <p>Application Angular + Laravel fonctionnant sous Docker</p>
        <button class="check-button" (click)="checkApiStatus()">Tester la connexion API</button>
      </div>
      
      <div class="api-result" *ngIf="apiStatus">
        <div class="success-message">
          <h3>{{ apiStatus.message }}</h3>
          <p>Statut: <span class="status">{{ apiStatus.status }}</span></p>
          <p class="timestamp">{{ apiStatus.timestamp }}</p>
        </div>
      </div>
      
      <div class="api-result" *ngIf="apiError">
        <div class="error-message">
          <h3>Erreur de connexion API</h3>
          <p>Impossible de contacter le serveur Laravel sur le port 9000.</p>
        </div>
      </div>
      
      <app-listings *ngIf="!apiError"></app-listings>
    </div>
  `,
  styles: [`
    .hello-container {
      max-width: 800px;
      margin: 50px auto;
      padding: 0 20px;
      font-family: 'Arial', sans-serif;
      text-align: center;
    }
    
    .hello-card {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      margin-bottom: 20px;
    }
    
    h1 {
      font-size: 3.5em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    
    h2 {
      font-size: 1.8em;
      margin-top: 0;
      margin-bottom: 20px;
      font-weight: 400;
    }
    
    p {
      font-size: 1.2em;
      margin-bottom: 30px;
    }
    
    .check-button {
      background: #2c3e50;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 25px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .check-button:hover {
      background: #1a252f;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    
    .api-result {
      margin-top: 20px;
      padding: 20px;
      border-radius: 8px;
      text-align: left;
    }
    
    .success-message {
      background-color: #e7f9f4;
      border-left: 4px solid #2ecc71;
      padding: 15px;
      border-radius: 4px;
    }
    
    .error-message {
      background-color: #fdeeee;
      border-left: 4px solid #e74c3c;
      padding: 15px;
      border-radius: 4px;
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
      color: #7f8c8d;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'LeMauvaisCoin';
  apiStatus: any = null;
  apiError: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.checkApiStatus();
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
