import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <div class="app-layout">
      <header>
        <div class="container">
          <div class="header-content">
            <div class="logo">
              <h1>LeMauvaisCoin</h1>
            </div>
            <nav>
              <ul>
                <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a></li>
                <li><a routerLink="/listings" routerLinkActive="active">Annonces</a></li>
                <li><a routerLink="/create" routerLinkActive="active">Déposer une annonce</a></li>
                <li><a href="#" class="disabled">Mon compte</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main class="container">
        <ng-content></ng-content>
      </main>
      
      <footer>
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>À propos de LeMauvaisCoin</h3>
              <p>Plateforme de petites annonces simple et efficace</p>
            </div>
            <div class="footer-section">
              <h3>Liens rapides</h3>
              <ul>
                <li><a href="#">Aide</a></li>
                <li><a href="#">Conditions d'utilisation</a></li>
                <li><a href="#">Politique de confidentialité</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h3>Contact</h3>
              <p>Email: contact&#64;lemauvaiscoin.fr</p>
              <p>Tél: +33 1 23 45 67 89</p>
            </div>
          </div>
          <div class="copyright">
            <p>&copy; 2025 LeMauvaisCoin - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    header {
      background-color: #e74c3c;
      padding: 15px 0;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo h1 {
      margin: 0;
      color: white;
      font-size: 1.5rem;
    }
    
    nav ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    nav li {
      margin-left: 20px;
    }
     nav a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.2s;
    }

    nav a:hover {
      opacity: 0.8;
    }

    nav a.active {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 15px;
      border-radius: 20px;
    }

    nav a.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    main {
      flex: 1;
      padding: 20px 0;
    }
    
    footer {
      background-color: #2c3e50;
      color: white;
      padding: 40px 0 20px;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 20px;
    }
    
    .footer-section h3 {
      margin-top: 0;
      font-size: 1.2rem;
      color: #e74c3c;
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-section li {
      margin-bottom: 8px;
    }
    
    .footer-section a {
      color: #ecf0f1;
      text-decoration: none;
    }
    
    .footer-section a:hover {
      text-decoration: underline;
    }
    
    .copyright {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #34495e;
      font-size: 0.9rem;
      color: #bdc3c7;
    }
  `]
})
export class LayoutComponent {
}
