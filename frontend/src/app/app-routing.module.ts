import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingsComponent } from './components/listings.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component'
import { FavorisComponent } from './components/favoris/favoris.component';
import { NewComponent } from './components/new/new.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { OtpComponent } from './components/otp/otp.component';
import { authGuard } from './guards/auth.guard';
import { AdComponent } from './components/ad/ad.component';
import { SearchPageComponent } from './components/search-page/search-page.component';

// Define routes
// const routes: Routes = [
//   {path: '', component: ListingsComponent},
//   {path: 'login', component: LoginComponent},
//   {path: 'register', component: RegisterComponent},
//   {path: 'favorites', component: FavorisComponent},
//   {path: 'new', component: NewComponent},
//   {path: '**', redirectTo: '', pathMatch: 'full' } // Redirect any unknown paths to the home page
// ]

const routes: Routes = [
  // Public routes (no guard needed)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'otp', component: OtpComponent },
  
  // Protected routes
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // Use the functional guard
    children: [
      { path: '', component: ListingsComponent },
      { path: 'home', component: HomeComponent },
      { path: 'favorites', component: FavorisComponent },
      { path: 'ads/:id', component: AdComponent },
      { path: 'search', component: SearchPageComponent },
      { path: 'new', component: NewComponent },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }