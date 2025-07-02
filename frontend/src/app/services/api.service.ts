import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get status from the API
  getApiStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`);
  }
  
  // Example method for future listings functionality
  getListings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listings`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login_check`, { email, password });
  }
}
