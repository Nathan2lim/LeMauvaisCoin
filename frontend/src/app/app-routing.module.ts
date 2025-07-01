import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingsComponent } from './components/listings.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component'
import { FavorisComponent } from './components/favoris/favoris.component';
import { OtpComponent } from './components/otp/otp.component';

// Define routes
const routes: Routes = [
  {path: '', component: ListingsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'favorites', component: FavorisComponent},
  {path: 'otp', component: OtpComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }