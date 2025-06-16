import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../core/services/toast.service';

@Component({
    standalone: true,
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    imports: [ToastModule, PasswordModule, ReactiveFormsModule],
    providers: [MessageService]
})
export class SignupComponent implements OnInit {
    signupForm!: FormGroup;

    constructor(
        private readonly fb: FormBuilder,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly toast: ToastService
    ) { }

    ngOnInit(): void {
        this.signupForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.signupForm.invalid) return;

        const { confirmPassword, ...payload } = this.signupForm.value;

        if (payload.password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        this.authService.signup(payload).subscribe({
            next: () => {
                this.toast.success('Signup Successful', `Welcome to FinTrack`);
                this.router.navigate(['/login']);
            },
            error: err => {
                alert('Signup failed!');
                console.error(err);
            }
        });
    }

    login() {
        this.router.navigate(['/login']);
    }
}
