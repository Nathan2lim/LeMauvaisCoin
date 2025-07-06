import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.css']
})
export class AdComponent implements OnInit {
  adId: string | null = null;
  selectedImage: string | null = null;
  showPhoneNumber: boolean = false;
  isFavorited: boolean = false;

  adContent: {
    id: number;
    title: string;
    description: string;
    price: number;
    city: string;
    zipcode: string;
    category: { id: number; title: string; };
    user: { name: string; };
    publishedAt: Date;
    images: { id: number; url: string; }[];
  } | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.adId = this.route.snapshot.paramMap.get('id');
    
    // Or use observable for dynamic updates
    this.route.paramMap.subscribe(params => {
      this.adId = params.get('id');
      if (this.adId) {
        this.apiService.getListingById(this.adId).subscribe({
          next: (data) => {
            this.adContent = {
              id: data.id,
              title: data.title,
              description: data.description,
              price: data.price,
              city: data.city,
              zipcode: data.zipcode,
              category: {
                id: data.category.id,
                title: data.category.name
              },
              user: {
                name: data.user.name
              },
              publishedAt: new Date(data.publishedAt),
              images: data.images.map((image: any) => ({
                id: image.id,
                url: 'http://localhost:8000' + image.url
              }))
            };
          },
          error: (error) => {
            console.error('Error fetching ad content:', error);
            // Handle error - maybe show a message to the user
          }
        });
      }
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  contactSeller(): void {
    // Implement contact functionality
    console.log('Contact seller clicked');
  }

  showPhone(): void {
    this.showPhoneNumber = !this.showPhoneNumber;
  }

  addToFavorites(): void {
    this.isFavorited = !this.isFavorited;
    // Implement favorites functionality
    console.log('Add to favorites:', this.isFavorited);
  }

  shareAd(): void {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: this.adContent?.title,
        text: this.adContent?.description,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  }

  reportAd(): void {
    // Implement report functionality
    console.log('Report ad clicked');
  }
}