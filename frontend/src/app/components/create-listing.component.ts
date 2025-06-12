import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-listing',
  template: `
    <div class="create-listing-container">
      <div class="page-header">
        <h1>Déposer une annonce</h1>
        <p>Remplissez le formulaire ci-dessous pour publier votre annonce</p>
      </div>

      <form class="listing-form" (ngSubmit)="onSubmit()">
        <div class="form-section">
          <h2>Informations générales</h2>
          
          <div class="form-group">
            <label for="title">Titre de l'annonce *</label>
            <input 
              type="text" 
              id="title" 
              name="title"
              [(ngModel)]="listing.title"
              placeholder="Ex: iPhone 12 Pro en excellent état"
              required
            >
          </div>

          <div class="form-group">
            <label for="category">Catégorie *</label>
            <select id="category" name="category" [(ngModel)]="listing.category" required>
              <option value="">Sélectionnez une catégorie</option>
              <option value="vehicules">Véhicules</option>
              <option value="immobilier">Immobilier</option>
              <option value="multimedia">Multimédia</option>
              <option value="maison">Maison & Jardin</option>
              <option value="loisirs">Loisirs</option>
              <option value="mode">Mode</option>
              <option value="emploi">Emploi</option>
              <option value="autres">Autres</option>
            </select>
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea 
              id="description" 
              name="description"
              [(ngModel)]="listing.description"
              placeholder="Décrivez votre article en détail..."
              rows="6"
              required
            ></textarea>
          </div>
        </div>

        <div class="form-section">
          <h2>Prix et localisation</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="price">Prix (€) *</label>
              <input 
                type="number" 
                id="price" 
                name="price"
                [(ngModel)]="listing.price"
                placeholder="0"
                min="0"
                required
              >
            </div>

            <div class="form-group">
              <label for="condition">État</label>
              <select id="condition" name="condition" [(ngModel)]="listing.condition">
                <option value="neuf">Neuf</option>
                <option value="tres-bon">Très bon état</option>
                <option value="bon">Bon état</option>
                <option value="satisfaisant">État satisfaisant</option>
                <option value="pour-pieces">Pour pièces</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="location">Localisation</label>
            <input 
              type="text" 
              id="location" 
              name="location"
              [(ngModel)]="listing.location"
              placeholder="Ville, code postal"
            >
          </div>
        </div>

        <div class="form-section">
          <h2>Photos</h2>
          <div class="image-upload">
            <div class="upload-placeholder">
              <div class="upload-icon">📷</div>
              <p>Glissez vos photos ici ou cliquez pour sélectionner</p>
              <p class="upload-hint">Format: JPG, PNG - Taille max: 5MB par photo</p>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Informations de contact</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="contactName">Nom *</label>
              <input 
                type="text" 
                id="contactName" 
                name="contactName"
                [(ngModel)]="listing.contactName"
                required
              >
            </div>

            <div class="form-group">
              <label for="contactPhone">Téléphone</label>
              <input 
                type="tel" 
                id="contactPhone" 
                name="contactPhone"
                [(ngModel)]="listing.contactPhone"
                placeholder="06 12 34 56 78"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="contactEmail">Email *</label>
            <input 
              type="email" 
              id="contactEmail" 
              name="contactEmail"
              [(ngModel)]="listing.contactEmail"
              required
            >
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="goBack()">
            Annuler
          </button>
          <button type="submit" class="btn-primary" [disabled]="!isFormValid()">
            Publier l'annonce
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .create-listing-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .page-header h1 {
      color: #2c3e50;
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    .page-header p {
      color: #7f8c8d;
      font-size: 1.1em;
    }

    .listing-form {
      background: white;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .form-section {
      padding: 30px;
      border-bottom: 1px solid #ecf0f1;
    }

    .form-section:last-child {
      border-bottom: none;
    }

    .form-section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.3em;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #2c3e50;
      font-weight: 500;
    }

    input, select, textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #e74c3c;
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }

    .image-upload {
      border: 2px dashed #ddd;
      border-radius: 10px;
      padding: 40px;
      text-align: center;
      transition: border-color 0.3s;
      cursor: pointer;
    }

    .image-upload:hover {
      border-color: #e74c3c;
    }

    .upload-placeholder {
      color: #7f8c8d;
    }

    .upload-icon {
      font-size: 3em;
      margin-bottom: 15px;
    }

    .upload-hint {
      font-size: 0.9em;
      margin-top: 10px;
    }

    .form-actions {
      padding: 30px;
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      background: #f8f9fa;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 25px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #e74c3c;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #c0392b;
    }

    .btn-primary:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background: #7f8c8d;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .btn-primary, .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class CreateListingComponent {
  listing = {
    title: '',
    category: '',
    description: '',
    price: null,
    condition: 'bon',
    location: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  };

  constructor(private router: Router) {}

  onSubmit(): void {
    if (this.isFormValid()) {
      console.log('Listing to create:', this.listing);
      // Here you would typically call an API service
      // this.apiService.createListing(this.listing).subscribe(...)
      
      // For now, just navigate back to listings
      alert('Annonce créée avec succès!');
      this.router.navigate(['/listings']);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.listing.title &&
      this.listing.category &&
      this.listing.description &&
      this.listing.price !== null &&
      this.listing.contactName &&
      this.listing.contactEmail
    );
  }

  goBack(): void {
    this.router.navigate(['/listings']);
  }
}
