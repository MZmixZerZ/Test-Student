import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, input, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonSearch, SearchConfig } from './common-search.type';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'common-search',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatTooltipModule
  ],
  templateUrl: './common-search.component.html',
  styleUrl: './common-search.component.scss'
})
export class CommonSearchComponent {
  @Input() searchConfig: SearchConfig;

  @Output() search: EventEmitter<CommonSearch> = new EventEmitter<CommonSearch>(null);
  @ViewChild('dropdownContainer', { static: false })dropdownContainer!: ElementRef;

  @ViewChild('picker') picker!: MatDateRangePicker<Date>;
  isPickerOpen = false;

  isDropdownOpen: boolean = false;
  initForm: FormGroup = null;

  isShowReset: boolean = false;

  constructor(
    private _formBuilder: FormBuilder
  ){
    this.initForm = this.initialForm()
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (
      this.dropdownContainer &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      if (!this.isPickerOpen) {
        this.isDropdownOpen = false;
      }
    }
  }

  get getStartDate() {
    return this.initForm.get('startDate');
  }

  get getEndDate() {
    return this.initForm.get('endDate');
  }

  get isActiveReset(): boolean {
    return Object.values(this.initForm.value).some(value => value !== '' && value !== null);
  }


  initialForm(): FormGroup {
    return this._formBuilder.group({
      keyword: [''],
      startDate: [''],
      endDate: ['']
    });
  }
  

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    setTimeout(() => {
      if (this.picker) {
        this.picker.openedStream.subscribe(() => {
          console.log('Picker opened');
          this.isPickerOpen = true;
        });

        this.picker.closedStream.subscribe(() => {
          console.log('Picker closed');
          this.isPickerOpen = false;
        });
      }
  }, 600);
  }

  onSearch(): void {
    const data = this.initForm.getRawValue();
    data.startDate = this.setTimeRange(data.startDate, 'start');
    data.endDate = this.setTimeRange(data.endDate, 'end');
    this.search.emit(data);
    this.toggleDropdown();

    if(this.isActiveReset){
      this.isShowReset = true;
    }
  }

  onReset(): void {
    this.initForm.reset();
    const data = this.initForm.getRawValue();
    this.search.emit(data);
    this.toggleDropdown();
    this.isShowReset = false;
  }

  onClearDateRange(): void {
    this.getStartDate.setValue('');
    this.getEndDate.setValue('');
  }

  setTimeRange(selectDate: Date, type: 'start' | 'end'): Date {
    if (!selectDate) return;
    const d = new Date(selectDate);
    
    if (type === 'start') {
      d.setHours(0, 0, 0, 0);
    } else {
      d.setHours(23, 59, 59, 999);
    }

    return d;
  }

}
