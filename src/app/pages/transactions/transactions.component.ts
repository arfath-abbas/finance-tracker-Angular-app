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
        CardModule
    ],
    templateUrl: './transactions.component.html',
    providers: [MessageService, ConfirmationService],
})
export class TransactionsComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly httpService = inject(HttpService);
    private readonly toast = inject(MessageService);
    private readonly confirm = inject(ConfirmationService);

    transactions: any[] = [];
    transactionForm!: FormGroup;
    showAddDialog = false;
    loading = false;
    selectedTx: any = null;

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
        this.httpService.get<any[]>('api/transactions/getAll').subscribe({
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

            if (this.selectedTx) {
                this.httpService
                    .put(`api/transactions/${this.selectedTx.id}`, tx)
                    .subscribe({
                        next: () => {
                            this.loadTransactions();
                            this.toast.add({
                                severity: 'success',
                                summary: 'Updated',
                                detail: 'Transaction updated successfully',
                            });
                            this.showAddDialog = false;
                            this.transactionForm.reset({ type: 'EXPENSE' });
                            this.selectedTx = null;
                        },
                        error: (err) => {
                            this.toast.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: this.httpService.handleErrorResponse(err),
                            });
                        },
                    });
            } else {
                this.httpService.post('api/transactions', tx).subscribe({
                    next: (res) => {
                        this.transactions = [...this.transactions, res];
                        this.toast.add({
                            severity: 'success',
                            summary: 'Added',
                            detail: 'Transaction added successfully',
                        });
                        this.showAddDialog = false;
                        this.transactionForm.reset({ type: 'EXPENSE' });
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
            accept: () => {
                this.httpService.delete(`api/transactions/${id}`).subscribe({
                    next: () => {
                        this.transactions = this.transactions.filter((t) => t.id !== id);
                        this.toast.add({
                            severity: 'success',
                            summary: 'Deleted',
                            detail: 'Transaction deleted successfully',
                        });
                        this.loadTransactions();
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
