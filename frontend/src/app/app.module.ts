import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { ListingsComponent } from './components/listings.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { ErrorMessageComponent } from './shared/error-message/error-message.component';
import { RegisterComponent } from './components/register/register.component';
import { FavButtonComponent } from './shared/fav-button/fav-button.component';
import { FavCardComponent } from './components/favoris/fav-card/fav-card.component';
import { FavorisComponent } from './components/favoris/favoris.component'

@NgModule({
  declarations: [
    AppComponent,
    ListingsComponent,
    LoginComponent,
    ErrorMessageComponent,
    RegisterComponent,
    FavButtonComponent,
    FavCardComponent,
    FavorisComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }