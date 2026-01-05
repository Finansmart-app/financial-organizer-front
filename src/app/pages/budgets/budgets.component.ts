import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { BudgetService } from '../../../services/budget.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateBudgetCopyComponent } from '../../modals/create-budget-copy/create-budget-copy.component';
import { BudgetDetail } from '../../models/budget.model';
import { omit } from '../../utils/functions.util';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent implements OnInit {
  private budgetService = inject(BudgetService);
  private userService = inject(UserService);
  private router = inject(Router);
  private matDialog = inject(MatDialog);
  private alertService = inject(AlertService);
  public budgets$ = this.budgetService.budgets;

  ngOnInit(): void {
    this.budgetService.getBudgets().subscribe();
    this.userService.getUserProfile().subscribe();
  }

  public newBudget(): void {
    this.router.navigate(['dashboard/budgets/new']);
  }

  public viewBudget(id: string): void {
    this.router.navigate(['dashboard/budgets', id]);
  }

  public getStatus(budget: any): string {
    if (budget.daysRemaining <= 0) return 'expired';
    if (budget.percentageUsed >= 90) return 'critical';
    if (budget.percentageUsed >= 70) return 'warning';
    return 'active';
  }

  public getStatusLabel(budget: any): string {
    const status = this.getStatus(budget);
    const labels: Record<string, string> = {
      expired: 'Vencido',
      critical: 'Crítico',
      warning: 'Alerta',
      active: 'Activo',
    };
    return labels[status];
  }

  public getProgressColor(budget: any): string {
    const status = this.getStatus(budget);
    const colors: Record<string, string> = {
      expired: '#71717a',
      critical: '#ef4444',
      warning: '#f59e0b',
      active: '#10b981',
    };
    return colors[status];
  }

  public getProgressBarColor(budget: any): 'primary' | 'accent' | 'warn' {
    if (budget.percentageUsed >= 90) return 'warn';
    if (budget.percentageUsed >= 70) return 'accent';
    return 'primary';
  }

  public deleteBudget(id: string, name: string): void {
    // TODO: Implementar modal construido
    if (confirm(`¿Estás seguro de eliminar el presupuesto "${name}"?`)) {
      this.budgetService.deleteBudget(id).subscribe(() => {
        this.budgetService.getBudgets().subscribe();
      });
    }
  }

  public duplicateBudget(budgetId: string): void {
    this.matDialog
      .open(CreateBudgetCopyComponent, {
        width: '500px',
        maxWidth: '80vw',
        disableClose: false,
        panelClass: 'custom-dialog-container',
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.budgetService.getBudgetById(budgetId).subscribe(budgetDetail => {
            const budgetRequest: BudgetDetail = budgetDetail;

            budgetRequest.name = result.name;
            budgetRequest.currency = result.currency.value;
            budgetRequest.startDate = result.startDate;
            budgetRequest.endDate = result.endDate;
            budgetRequest.expenses = budgetDetail.expenses.map(exp => {
              exp.status = 'PENDING';
              return omit(exp, 'id');
            });
            budgetRequest.incomes = budgetDetail.incomes.map(income =>
              omit(income, 'id')
            );

            console.log(budgetRequest);
            this.budgetService.createBudget(budgetRequest).subscribe({
              next: () => {
                this.alertService.showSuccess('Presupuesto duplicado exitosamente');
                this.budgetService.getBudgets().subscribe();
              },
              error: () => {
                this.alertService.showError('Error al duplicar el presupuesto');
              },
            });
          });
        }
      });
  }
}
