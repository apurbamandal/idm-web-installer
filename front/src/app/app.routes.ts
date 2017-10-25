import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { LoginFormComponent } from './login';
import { NotFoundComponent } from './utils';
import { DataResolver } from './app.resolver';
import { InstallComponent } from './install/install.component';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginFormComponent },
  // { path: 'sessionexpired', component: SessionExpiredComponent },
  // { path: 'forgot-password', component: ErrorMessage },
  { path: 'home', component: HomeComponent },
  { path: 'install', component: InstallComponent },
  { path: '**', component: NotFoundComponent }
];
