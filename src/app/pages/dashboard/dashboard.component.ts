import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [CommonModule, ChartModule, DatePickerModule, ProgressBarModule, FormsModule],
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	dashboard: any;
	selectedMonth: Date = new Date();

	chartData: any;
	chartOptions: any;

	constructor(private readonly dashboardService: DashboardService) { }

	ngOnInit(): void {
		this.fetchDashboardData();
	}

	fetchDashboardData(): void {
		const year = this.selectedMonth.getFullYear();
		const month = (this.selectedMonth.getMonth() + 1).toString().padStart(2, '0');
		const monthStr = `${year}-${month}`;

		this.dashboardService.getDashboardData(monthStr).subscribe((data: any) => {
			this.dashboard = data;
			this.prepareChart(data.dailySpending);
		});
	}


	prepareChart(dailySpending: any[]) {
		if (!dailySpending || dailySpending.length === 0) {
			this.chartData = null;
			return;
		}

		this.chartData = {
			labels: dailySpending.map(s => s.day.toString()),
			datasets: [
				{
					label: 'Daily Spending',
					data: dailySpending.map(s => s.amount),
					backgroundColor: '#7C3AED',
					borderRadius: 5
				}
			]
		};

		this.chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false
				}
			},
			scales: {
				x: {
					ticks: { color: '#333' },
					grid: { display: false }
				},
				y: {
					ticks: { color: '#333' },
					grid: { color: '#eee' }
				}
			}
		};
	}

	getCategoryPercentage(amount: number): number {
		const total = this.dashboard?.categorySpending.reduce((acc: number, item: any) => acc + item.amount, 0) ?? 0;
		return total ? Math.round((amount / total) * 100) : 0;
	}
}
