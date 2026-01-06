import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BudgetService } from '../../../services/budget.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ButtonComponent } from '../../components/button/button.component';
import { ScreenSizeService } from '../../../services/screen-size.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonComponent, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private budgetsService = inject(BudgetService);
  private userService = inject(UserService);
  private screenSizeService = inject(ScreenSizeService);
  private router = inject(Router);
  private destroy$: Subject<void> = new Subject<void>();
  public userData = this.userService.userData;

  public isSidebarOpen: boolean = false;
  public items = [
    { label: 'Tablero', icon: 'dashboard', route: '', active: true },
    {
      label: 'Presupuestos',
      icon: 'account_balance_wallet',
      route: '/budgets',
      active: false,
    },
    { label: 'Categorías', icon: 'category', route: '/categories', active: false },
    // { label: 'Transacciones', icon: 'swap_horiz', route: '/transactions', active: false },
    // { label: 'Reportes', icon: 'bar_chart', route: '/reports', active: false },
    // { label: 'Configuración', icon: 'settings', route: '/settings', active: false },
  ];
  public isMobile: boolean = false;

  ngOnInit(): void {
    // Inicializar datos necesarios al cargar el layout del dashboard
    combineLatest([
      this.budgetsService.getBudgets(),
      this.userService.getUserProfile(),
    ]).subscribe();

    this.screenSizeService.screenSize$.pipe(takeUntil(this.destroy$)).subscribe(size => {
      this.isMobile = size.isMobile || size.isTablet;
    });
  }

  public toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  public closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  public async logout(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
