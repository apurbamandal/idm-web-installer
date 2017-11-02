import { Routes } from '@angular/router';
import {DemoComponent} from "./demo/demo.component";
import {LoginComponent} from "./login/login.component";
import {InstallComponent} from "./install/install.component";

export const ROUTES: Routes = [

  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'demo', component: DemoComponent},
  {path: 'install', component: InstallComponent}
];
