import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

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
        this.messageService.add({ severity: 'success', summary: 'Login Successful' });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err.error.message });
      }
    });
  }
}