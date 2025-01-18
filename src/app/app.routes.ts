import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { ProductsComponent } from './products/products.component';
import { SalesComponent } from './sales/sales.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'sales',
    component: SalesComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
];
