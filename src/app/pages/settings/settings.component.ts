import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
	standalone: true,
	selector: 'app-settings',
	imports: [CommonModule, ButtonModule],
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss'
})
export class SettingsComponent {
	constructor(private readonly authService: AuthService) { }

	logout(): void {
		this.authService.logout();
	}
}
