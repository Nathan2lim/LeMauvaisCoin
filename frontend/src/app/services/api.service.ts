import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private userToken: string | null = null;

  constructor(private http: HttpClient) { }

  setUserToken(token: string): void {
    this.userToken = token;
  }

  // Get status from the API
  getApiStatus(): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.userToken}` };
    return this.http.get(`${this.apiUrl}/status`, { headers });
  }
  
  // Example method for future listings functionality
  getListings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listings`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login_check`, { email, password });
  }

  register(email: string, name: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, name, password });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  postNewListing(listingData: any, images: File[]): Observable<any> {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', listingData.title || '');
    formData.append('description', listingData.description || '');
    formData.append('price', listingData.price || '');
    formData.append('city', listingData.location || '');
    formData.append('zipcode', '75000'); // Default zipcode for now
    formData.append('category', listingData.category || '');
    formData.append('user', '1'); // Default user for now

    // Add image files
    images.forEach((file, index) => {
      formData.append('images[]', file, file.name);
    });

    const headers: any = {};
    if (this.userToken) {
      headers['Authorization'] = `Bearer ${this.userToken}`;
    }

    return this.http.post(`${this.apiUrl}/ads`, formData, { headers });
  }
}
