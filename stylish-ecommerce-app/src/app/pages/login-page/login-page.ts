import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // For notifications

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage { // Changed from LoginPageComponent
  constructor(private router: Router, private toastr: ToastrService) {}

  onLogin(form: NgForm) {
    if (form.valid) {
      console.log('Login form submitted:', form.value);
      // Simulate login
      this.toastr.success('Logged in successfully!', 'Login Successful');
      this.router.navigate(['/']); // Navigate to home page
    } else {
      this.toastr.error('Please fill in all required fields.', 'Login Failed');
    }
  }
}
