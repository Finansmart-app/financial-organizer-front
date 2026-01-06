import { inject, Injectable } from '@angular/core';
import { HttpClientService } from './http/http-client.service';
import { Category } from '../app/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClientService);

  public createCategory(category: Partial<Category>): Observable<unknown> {
    return this.http.post<unknown>('category', { body: category });
  }

  public deleteCategory(categoryId: string): Observable<unknown> {
    return this.http.delete<unknown>(`category/${categoryId}`);
  }
}
