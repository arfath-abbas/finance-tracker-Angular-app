import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { HttpService } from '../../../core/services/http.service';
import { CardModule } from 'primeng/card';
import { TransactionService } from '../../../core/services/transaction.service';
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
        ToastModule,
        TooltipModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        ReactiveFormsModule,
        CardModule,
        DropdownModule
    ],
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly httpService = inject(HttpService);
    private readonly toast = inject(MessageService);
    private readonly confirm = inject(ConfirmationService);
    private readonly txService = inject(TransactionService);

    transactions: any[] = [];
    transactionForm!: FormGroup;
    showAddDialog = false;
    loading = false;
    selectedTx: any = null;
    typeOptions = [
        { label: 'Expense', value: 'EXPENSE' },
        { label: 'Income', value: 'INCOME' }
    ];

    ngOnInit(): void {
        this.transactionForm = this.fb.group({
            transactionDate: ['', Validators.required],
            description: ['', Validators.required],
            category: ['', Validators.required],
            amount: [null, Validators.required],
            type: ['EXPENSE', Validators.required],
        });

        this.loadTransactions();
    }

    loadTransactions() {
        this.loading = true;
        this.txService.getAll().subscribe({
            next: (res: any[]) => {
                this.transactions = res;
                this.loading = false;
            },
            error: (err) => {
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: this.httpService.handleErrorResponse(err),
                });
                this.loading = false;
            },
        });
    }

    openAddDialog() {
        this.selectedTx = null;
        this.transactionForm.reset({ type: 'EXPENSE' });
        this.showAddDialog = true;
    }

    saveTransaction() {
        if (this.transactionForm.valid) {
            const tx = this.transactionForm.value;

            // Edit Mode
            if (this?.selectedTx) {
                const id = this.selectedTx.id;

                this.txService.update(id, tx).subscribe({
                    next: () => {
                        this.loadTransactions();
                        this.toast.add({
                            severity: 'success',
                            summary: 'Updated',
                            detail: 'Transaction updated successfully',
                        });
                        this.resetForm();
                    },
                    error: (err) => {
                        this.toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: this.httpService.handleErrorResponse(err),
                        });
                    },
                });
            }
            // Add Mode
            else {
                this.txService.create(tx).subscribe({
                    next: (res) => {
                        this.transactions = [...this.transactions, res];
                        this.toast.add({
                            severity: 'success',
                            summary: 'Added',
                            detail: 'Transaction added successfully',
                        });
                        this.resetForm();
                    },
                    error: (err) => {
                        this.toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: this.httpService.handleErrorResponse(err),
                        });
                    },
                });
            }
        }
    }

    editTransaction(tx: any) {
        this.selectedTx = tx;
        this.transactionForm.patchValue(tx);
        this.showAddDialog = true;
    }

    deleteTransaction(id: number) {
        this.confirm.confirm({
            message: 'Are you sure you want to delete this transaction?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            accept: () => {
                this.txService.delete(id).subscribe({
                    next: (message: string) => {
                        this.transactions = this.transactions.filter((t) => t.id !== id);
                        this.toast.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: message,
                        });
                    },
                    error: (err) => {
                        this.toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: this.httpService.handleErrorResponse(err),
                        });
                    },
                });
            },
        });
    }

    resetForm() {
        this.showAddDialog = false;
        this.transactionForm.reset({ type: 'EXPENSE' });
        this.selectedTx = null;
    }

    categoryBadge(category: string): string {
        let badgeClass: string;

        switch (category) {
            case 'FOOD':
                badgeClass = 'bg-success text-white';
                break;
            case 'RENT':
                badgeClass = 'bg-danger text-white';
                break;
            default:
                badgeClass = 'bg-warning text-dark';
                break;
        }

        return badgeClass;
    }


    typeBadge(type: string): string {
        return type === 'EXPENSE' ? 'bg-danger text-white' : 'bg-primary text-white';
    }
}
