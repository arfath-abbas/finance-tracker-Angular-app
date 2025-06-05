import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  transactions: any[] = [];
  showAddDialog = false;
  transactionForm!: FormGroup;

  ngOnInit(): void {
    this.loadTransactions();
    this.transactionForm = this.fb.group({
      transactionDate: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      amount: [null, Validators.required],
      type: ['EXPENSE', Validators.required],
    });
  }

  loadTransactions() {
    this.http
      .get<any[]>('/api/transactions/getAll') // replace with actual URL
      .subscribe((data) => (this.transactions = data));
  }

  saveTransaction() {
    if (this.transactionForm.valid) {
      const newTx = { ...this.transactionForm.value };
      this.transactions = [...this.transactions, newTx]; // Optimistic update

      // Optional: call POST API here
      // this.http.post('/api/transactions', newTx).subscribe(...);

      this.showAddDialog = false;
      this.transactionForm.reset({ type: 'EXPENSE' });
    }
  }

  categoryBadge(category: string): string {
    return 'bg-primary-subtle text-primary-emphasis'; // you can make dynamic if needed
  }

  typeBadge(type: string): string {
    return type === 'INCOME'
      ? 'bg-success-subtle text-success-emphasis'
      : 'bg-danger-subtle text-danger-emphasis';
  }
}
