import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface SearchResponse {
  total: number;
  items: any[]; // Vous pouvez définir un type plus précis pour les annonces
  limit: number;
  offset: number;
  query: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${environment.apiUrl}/api/search`;

  constructor(private http: HttpClient) { }

  /**
   * Effectue une recherche avancée dans les annonces
   * 
   * @param query Le terme de recherche
   * @param limit Nombre maximum de résultats (défaut: 10)
   * @param offset Décalage pour la pagination (défaut: 0)
   * @param onlyPublished Si true, retourne uniquement les annonces publiées (défaut: true)
   * @returns Observable des résultats de recherche
   */
  search(query: string, limit: number = 10, offset: number = 0, onlyPublished: boolean = true): Observable<SearchResponse> {
    let params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .set('onlyPublished', onlyPublished.toString());

    return this.http.get<SearchResponse>(this.apiUrl, { params });
  }
}
