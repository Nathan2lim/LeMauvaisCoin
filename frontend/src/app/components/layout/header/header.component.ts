import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  searchQuery: string = '';

  constructor(private router: Router) {

  }

  goToNew(): void {
    this.router.navigate(['/new']);
  }
  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToSearch(): void {
    if (!this.searchQuery.trim()) {
      // If search query is empty, do not navigate
      return;
    }
    const currentUrl = this.router.url;
    const isOnSearchPage = currentUrl.includes('/search');
    
    if (isOnSearchPage) {
      // Force reload by navigating to a dummy route then back
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      });
    } else {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

}
