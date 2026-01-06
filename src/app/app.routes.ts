import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { tokenGuard } from './guards/token.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard], // Redirige a dashboard si ya está logueado
  },
  // TODO: Signup temporalmente oculto
  // {
  //   path: 'sign-up',
  //   loadComponent: () =>
  //     import('./pages/auth/sign-up/sign-up.component').then(m => m.SignUpComponent),
  //   canActivate: [loginGuard], // Redirige a dashboard si ya está logueado
  // },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component').then(
        m => m.ResetPasswordComponent
      ),
    canActivate: [loginGuard], // Redirige a dashboard si ya está logueado
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        m => m.DashboardLayoutComponent
      ),
    canActivate: [tokenGuard], // Protege con validación de token JWT
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [tokenGuard],
      },
      {
        path: 'budgets',
        loadComponent: () =>
          import('./pages/budgets/budgets.component').then(m => m.BudgetsComponent),
        canActivate: [tokenGuard],
      },
      {
        path: 'budgets/new',
        loadComponent: () =>
          import('./pages/budgets/new-budget/new-budget.component').then(
            m => m.NewBudgetComponent
          ),
        canActivate: [tokenGuard],
      },
      {
        path: 'budgets/:id',
        loadComponent: () =>
          import('./pages/budgets/budget-detail/budget-detail.component').then(
            m => m.BudgetDetailComponent
          ),
        canActivate: [tokenGuard],
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories.component').then(
            m => m.CategoriesComponent
          ),
        canActivate: [tokenGuard],
      },
    ],
  },
  // Mantener home como redirect temporal
  {
    path: 'home',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
