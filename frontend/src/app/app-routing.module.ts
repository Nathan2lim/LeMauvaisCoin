import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ListingsComponent } from './components/listings.component';
import { CreateListingComponent } from './components/create-listing.component';
import { ListingDetailComponent } from './components/listing-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'listings', component: ListingsComponent },
  { path: 'listing/:id', component: ListingDetailComponent },
  { path: 'create', component: CreateListingComponent },
  { path: '**', redirectTo: '' } // Wildcard route for 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
