import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingsComponent } from './components/listings.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component'
import { FavorisComponent } from './components/favoris/favoris.component';
import { NewComponent } from './components/new/new.component';

// Define routes
const routes: Routes = [
  {path: '', component: ListingsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'favorites', component: FavorisComponent},
  {path: 'new', component: NewComponent},
  {path: '**', redirectTo: '', pathMatch: 'full' } // Redirect any unknown paths to the home page
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }