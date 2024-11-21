import { Component } from '@angular/core';
import { ContatctService } from '../Service/contatct.service';
import { CustomToastrService } from '../custom-toastr.service';
import { Router } from '@angular/router';
import { Contact } from '../contact';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-addcontact',
  templateUrl: './addcontact.component.html',
  styleUrl: './addcontact.component.css'
})
export class AddcontactComponent {
  contact: Contact = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: ''
  };
  @Output() contactAdded = new EventEmitter<void>();


  constructor(
    private contactService: ContatctService,
    private toastrService: CustomToastrService,
    private router: Router
  ) {}

  addContact(): void {
    this.contactService.createContact(this.contact).subscribe(() => {
      this.contactAdded.emit();
      this.resetForm();
    });
  }


  resetForm(): void {
    this.contact = {
      firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: ''
    };
  }



  // Add(): void {
  //   this.contactService.createContact(this.contact).subscribe(
  //     (data) => {
  //       this.toastrService.showSuccess('Contact added successfully!');
  //       this.router.navigate(['/dashboard/contactlist']); 
  //     },
  //     (error) => {
  //       console.error('Error adding contact:', error); // Log the full error
  //       this.toastrService.showError('Error adding contact.');
  //     }
  //   );
  // }

  goBack(): void {
    this.router.navigate(['/dashboard/contactlist']); 
  }

}
