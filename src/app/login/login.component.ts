import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly toast: ToastService,
        private readonly messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.route.queryParams.subscribe(params => {
            if (params['sessionExpired']) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Session Expired',
                    detail: 'Please login again.',
                    life: 3000
                });
            }
        });
    }

    login(): void {
        if (this.loginForm.invalid) return;

        this.authService.login(this.loginForm.value).subscribe({
            next: (res) => {
                localStorage.setItem('token', res.token);
                this.toast.success('Login Successful', `Welcome back, ${res.firstName}`);
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                const errorMessage = err?.error?.message ?? 'Server is unreachable. Please try again later.';
                this.toast.error(errorMessage);
            }
        });
    }

    signUp() {
        this.router.navigate(['/signup']);
    }
}