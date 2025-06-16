import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

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
        private readonly toast: ToastService
    ) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
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
                this.toast.error(err.error.message);
            }
        });
    }

    signUp() {
        this.router.navigate(['/signup']);
    }
}