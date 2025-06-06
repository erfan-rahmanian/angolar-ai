import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPage { // Changed from RegisterPageComponent
  constructor(private router: Router, private toastr: ToastrService) {}

  onRegister(form: NgForm) {
    if (form.valid && !form.errors?.['passwordMismatch']) {
      console.log('Register form submitted:', form.value);
      // Simulate registration
      this.toastr.success('Registered successfully! Please login.', 'Registration Successful');
      this.router.navigate(['/login']); // Navigate to login page
    } else if(form.errors?.['passwordMismatch']) {
       this.toastr.error('Passwords do not match.', 'Registration Failed');
    }
     else {
      this.toastr.error('Please fill in all required fields correctly.', 'Registration Failed');
    }
  }

  checkPasswords(form: NgForm) {
    const password = form.controls['password']?.value;
    const confirmPassword = form.controls['confirmPassword']?.value;

    if (password !== confirmPassword) {
      form.controls['confirmPassword'].setErrors({ 'passwordMismatch': true });
      // Set error on the form itself for easier disabling of submit button
      form.form.setErrors({'passwordMismatch': true});
    } else {
      // Clear only the passwordMismatch error, not other potential errors on confirmPassword
      if (form.controls['confirmPassword']?.errors?.['passwordMismatch']) {
         const errors = form.controls['confirmPassword'].errors;
         delete errors?.['passwordMismatch'];
         form.controls['confirmPassword'].setErrors(Object.keys(errors || {}).length > 0 ? errors : null);
      }
      if (form.form.errors?.['passwordMismatch']) {
        delete form.form.errors['passwordMismatch'];
         form.form.setErrors(Object.keys(form.form.errors || {}).length > 0 ? form.form.errors : null);
      }
    }
  }
}
