import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CustomToastrService {

  constructor(private toastr: ToastrService) { }

  // Success message
  showSuccess(message: string, title: string = 'Success') {
    this.toastr.success(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
    });
  }

  // Error message
  showError(message: string, title: string = 'Error') {
    this.toastr.error(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
    });
  }

  // Info message
  showInfo(message: string, title: string = 'Information') {
    this.toastr.info(message, title, {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
    });
  }

  // Warning message
  showWarning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title, {
      timeOut: 4000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
    });
  }
}