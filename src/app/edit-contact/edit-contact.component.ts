import { Component } from '@angular/core';
import { Contact } from '../contact';
import { OnInit } from '@angular/core';
import { ContatctService } from '../Service/contatct.service';
import { ActivatedRoute } from '@angular/router';
import { CustomToastrService } from '../custom-toastr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.css'
})
export class EditContactComponent implements OnInit {
  contact: Contact = {
    contactID: 0,
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

  constructor(
    private contactService: ContatctService,
    private toastrService: CustomToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const contactId = Number(this.route.snapshot.paramMap.get('id'));
    this.getContactById(contactId);
  }

  getContactById(contactId: number): void {
    this.contactService.getContactById(contactId).subscribe(
      (contact) => {
        this.contact = contact;
      },
      (error) => {
        console.error('Error fetching contact:', error);
      }
    );
  }


  updateContact(): void {
    this.contactService.updateContact(this.contact).subscribe(
      (updatedContact) => {
        console.log('Contact updated successfully', updatedContact);
        this.router.navigate(['/dashboard/contactlist']); 
      },
      (error) => {
        console.error('Error updating contact:', error);
      }
    );
  }
}
