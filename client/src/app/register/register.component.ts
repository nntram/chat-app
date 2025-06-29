import { Component, inject, signal } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email!: string;
  userName!: string;
  password!: string;
  fullName!: string;
  profilePicture: string = 'https://static.vecteezy.com/system/resources/previews/024/966/233/non_2x/businesswoman-portrait-beautiful-woman-in-business-suit-employee-of-business-institution-in-uniform-lady-office-worker-woman-business-avatar-profile-picture-illustration-vector.jpg';
  profileImage: File | null = null;

  authService = inject(AuthServiceService);
  hide = signal(true);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.profileImage = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicture = e.target!.result as string;
        console.log(e.target?.result);
      }

      reader.readAsDataURL(file);
      console.log(this.profilePicture);
    }
  }

  register() {
    let formData = new FormData();
    formData.append('email', this.email);
    formData.append('userName', this.userName);
    formData.append('password', this.password);
    formData.append('fullName', this.fullName);
    formData.append('profileImage', this.profileImage!);

    this.authService.register(formData).subscribe({
      next: () => {
        this.snackBar.open('User register successfully', 'Close');
      },
      error: (error: HttpErrorResponse) => {
        let err = error.error as ApiResponse<string>;
        this.snackBar.open(err.error, 'Close');
      }, 
      complete: () => {
        this.router.navigate(['/']);
      }
    })
  }
}
