import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { SelectInputComponent } from '../../components/select-input/select-input.component';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { CURRENCY_OPTIONS } from '../../utils/constants/currency-option.constant';
import { SelectOption } from '../../models/select.model';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ButtonComponent } from '../../components/button/button.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-budget-copy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    SelectInputComponent,
    DatePickerComponent,
    ButtonComponent,
  ],
  templateUrl: './create-budget-copy.component.html',
  styleUrl: './create-budget-copy.component.scss',
})
export class CreateBudgetCopyComponent implements OnInit, OnDestroy {
  public form = new FormGroup({
    name: new FormControl('', Validators.required),
    currency: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
  });
  public currencyOptions: SelectOption[] = CURRENCY_OPTIONS;
  public minDate: Date = new Date();
  public buttonnDisabled: boolean = true;
  private destroy$: Subject<void> = new Subject<void>();
  private dialogRef = inject(MatDialogRef<CreateBudgetCopyComponent>);

  ngOnInit(): void {
    this.form
      .get('startDate')
      ?.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(startDate => {
        this.minDate = startDate ? new Date(startDate) : new Date();
      });
    this.form.statusChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(status => {
        this.buttonnDisabled = status !== 'VALID';
      });
  }

  public closeModal(cancel: boolean): void {
    this.dialogRef.close(!cancel ? this.form.value : null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
