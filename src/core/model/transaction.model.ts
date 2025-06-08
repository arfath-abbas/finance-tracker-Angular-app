export interface Transaction {
    id: number;
    transactionDate: string;
    description: string;
    category: string;
    amount: number;
    type: 'EXPENSE' | 'INCOME';
}
