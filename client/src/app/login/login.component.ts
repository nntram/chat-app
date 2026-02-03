import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email!: string;
  password!: string;

  authService = inject(AuthService);
  hide = signal(true);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.authService.me().subscribe();
        this.snackBar.open('Login successfully', 'Close');
      },
      error: (error: HttpErrorResponse) => {
        let err = error.error as ApiResponse<string>;
        this.snackBar.open(err.error, 'Close', { duration: 3000 });
      },
      complete: () => {
        this.router.navigate(['/']);
      }
    })
  }
}
