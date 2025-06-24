import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [
    `::ng-deep app-login {
      display: flex;
      justify-content: space-between;
      width: 100%;
      min-height: 100vh;
    }`
  ]
})
export class AppComponent {

}