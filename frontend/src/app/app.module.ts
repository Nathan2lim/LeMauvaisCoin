import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home.component';
import { ListingsComponent } from './components/listings.component';
import { CreateListingComponent } from './components/create-listing.component';
import { ListingDetailComponent } from './components/listing-detail.component';
import { LayoutComponent } from './components/layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListingsComponent,
    CreateListingComponent,
    ListingDetailComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
