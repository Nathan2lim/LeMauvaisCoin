import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { ListingsComponent } from './components/listings.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { ErrorMessageComponent } from './shared/error-message/error-message.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { CategoryComponent } from './components/category/category.component'
import { RegisterComponent } from './components/register/register.component';
import { FavButtonComponent } from './shared/fav-button/fav-button.component';
import { FavCardComponent } from './components/favoris/fav-card/fav-card.component';
import { FavorisComponent } from './components/favoris/favoris.component';
import { NewComponent } from './components/new/new.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { OtpComponent } from './components/otp/otp.component';
import { AdComponent } from './components/ad/ad.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    ListingsComponent,
    LoginComponent,
    ErrorMessageComponent,
    HomeComponent,
    HeaderComponent,
    CategoryComponent,
    RegisterComponent,
    FavButtonComponent,
    FavCardComponent,
    FavorisComponent,
    NewComponent,
    FooterComponent,
    MainLayoutComponent,
    OtpComponent,
    AdComponent,
    SearchPageComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgOptimizedImage
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }