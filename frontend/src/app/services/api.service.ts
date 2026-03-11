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

  getUserToken(): string | null {
    if (!this.userToken) {
      if(localStorage.getItem('auth_token')) {
        this.userToken = localStorage.getItem('auth_token');
      }else {
        console.warn('No user token found in localStorage or service.');
        return null;
      }
    }
  return this.userToken;
  }

  // Get status from the API
  getApiStatus(): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.userToken}` };
    return this.http.get(`${this.apiUrl}/status`, { headers });
  }
  
  // Retrieve ads from the API
  getListings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ads`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login_check`, { email, password });
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

    const headers = { 'Authorization': `Bearer ${this.getUserToken()}` };


    return this.http.post(`${this.apiUrl}/ads`, formData, { headers });
  }

  getListingById(id: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.getUserToken()}` };
    return this.http.get(`${this.apiUrl}/ads/${id}`, { headers });
  }


  getUserInfo(): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.getUserToken()}` };
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  getSearchResults(query: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.getUserToken()}` };
    return this.http.get(`${this.apiUrl}/search`, {
      headers,
      params: { q: query }
    });
  }
}
