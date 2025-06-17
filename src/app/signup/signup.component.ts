import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../core/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    imports: [CommonModule, ToastModule, PasswordModule, ReactiveFormsModule],
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
            username: this.fb.control('', Validators.required),
            email: this.fb.control('', [Validators.required, Validators.email]),
            firstName: this.fb.control('', Validators.required),
            lastName: this.fb.control('', Validators.required),
            password: this.fb.control('', [
                Validators.required,
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
            ]),
            confirmPassword: this.fb.control('', Validators.required)
        }, {
            validators: this.passwordsMatchValidator
        } as AbstractControlOptions)
    }

    passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        return password === confirmPassword ? null : { passwordMismatch: true };
    }


    onSubmit(): void {
        if (this.signupForm.invalid) return;

        const { confirmPassword, ...payload } = this.signupForm.value;

        if (payload.password !== confirmPassword) {
            this.signupForm.setErrors({ passwordMismatch: true });
            return;
        }

        this.authService.signup(payload).subscribe({
            next: () => {
                this.toast.success('Signup Successful', `Welcome to FinTrack`);
                this.router.navigate(['/login']);
            },
            error: err => {
                const errorCode = err?.error?.message;

                if (errorCode === 'UsernameTaken') {
                    this.signupForm.get('username')?.setErrors({ usernameTaken: true });
                } else if (errorCode === 'EmailTaken') {
                    this.signupForm.get('email')?.setErrors({ emailTaken: true });
                } else {
                    this.toast.error('Error', 'Something went wrong');
                    console.error(err);
                }
            }
        });
    }


    login() {
        this.router.navigate(['/login']);
    }
}
