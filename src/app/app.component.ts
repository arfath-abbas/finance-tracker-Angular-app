import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../core/services/auth.service';

@Component({
    standalone: true,
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, RouterModule, ToastModule, ConfirmDialogModule
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private readonly router: Router, public authService: AuthService) { }

    title = 'finance-tracker-app';

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
        }
    }

    navigate() {
        this.router.navigate(['/dashboard']);
    }
}
