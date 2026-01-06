import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { CategoryService } from '../../../services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../services/alert.service';
import { CreateCategoryModalComponent } from '../../modals/create-category-modal/create-category-modal.component';
import { Category } from '../../models/user.model';
import { UserService } from '../../../services/user.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatMenuModule, MatIconModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private alertService = inject(AlertService);
  public categories: Category[] = [];
  constructor() {
    effect(() => {
      this.categories = this.userService.userCategories();
    });
  }

  public addCategory(): void {
    const dialogRef = this.dialog.open(CreateCategoryModalComponent, {
      width: '500px',
      maxWidth: '80vw',
      disableClose: false,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const requestBody: Partial<Category> = {
          name: result.name,
          icon: result.icon,
          color: result.color,
        };
        this.categoryService.createCategory(requestBody).subscribe({
          next: () => {
            this.userService.getUserProfile().subscribe();
            this.alertService.showSuccess('Categoría creada exitosamente.');
          },
          error: () => {
            this.alertService.showError('Error al crear la categoría.');
          },
        });
      }
    });
  }

  public deleteCategory(categoryId: string): void {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.userService.getUserProfile().subscribe();
        this.alertService.showSuccess('Categoría eliminada exitosamente.');
      },
      error: () => {
        this.alertService.showError('Error al eliminar la categoría.');
      },
    });
  }
}
