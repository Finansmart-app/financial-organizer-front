import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../components/input/input.component';
import { SelectInputComponent } from '../../../../../components/select-input/select-input.component';
import { DatePickerComponent } from '../../../../../components/date-picker/date-picker.component';
import { SelectOption } from '../../../../../models/select.model';
import { MatIconModule } from '@angular/material/icon';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CURRENCY_OPTIONS } from '../../../../../utils/constants/currency-option.constant';

@Component({
  selector: 'app-budget-info-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputComponent,
    SelectInputComponent,
    DatePickerComponent,
    MatIconModule,
  ],
  templateUrl: './budget-info-step.component.html',
  styleUrl: './budget-info-step.component.scss',
})
export class BudgetInfoStepComponent implements OnInit, OnDestroy {
  @Input() public formGroup!: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  public minDate: Date = new Date();
  public currencyOptions: SelectOption[] = CURRENCY_OPTIONS;

  ngOnInit(): void {
    this.formGroup
      .get('startDate')
      ?.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(startDate => {
        this.minDate = startDate ? new Date(startDate) : new Date();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
