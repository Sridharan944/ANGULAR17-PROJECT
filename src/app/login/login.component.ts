import { Component } from '@angular/core';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CustomToastrService } from '../custom-toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  loginError: string = '';


  constructor(private authService: AuthService, private router: Router,private http: HttpClient,private toastrService: CustomToastrService) {}


  login(): void {
    const loginUrl = 'https://localhost:44383/api/Auth/login';

    this.http.post<{ token: string; userid: number }>(loginUrl, {
      username: this.username,
      password: this.password
    }).subscribe(
      response => {
       
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('userId', response.userid.toString());

        this.toastrService.showSuccess('Login successful!', 'Welcome');
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.toastrService.showError('Login failed', 'Invalid username or password');
       

      }
    );
  }
}
