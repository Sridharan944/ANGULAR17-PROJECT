import { Component } from '@angular/core';
import { ContatctService } from '../Service/contatct.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CustomToastrService } from '../custom-toastr.service';
import { Contact } from '../contact';
import Swal from 'sweetalert2';
import { ViewChild } from '@angular/core';
import { ElementRef ,Inject} from '@angular/core';
import * as bootstrap from 'bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';



@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrl: './contactlist.component.css'
})
export class ContactlistComponent {

  contacts: Contact[] = [];
  contactID: number | null = null;
  filteredContacts: Contact[] = []; 
  // selectedContact: Contact | null = null;

  searchTerm: string = '';
  @ViewChild('addContactModal') addContactModal!: ElementRef;

  isBrowser: boolean;
  


  constructor(private contactService: ContatctService,private router: Router,
    private http: HttpClient,private toastrService: CustomToastrService,
    @Inject(PLATFORM_ID) private platformId: Object) { 

      this.isBrowser = isPlatformBrowser(this.platformId);
    }

 
 
    

  ngOnInit(): void {
    this.fetchContacts();
  }



  fetchContacts(): void {
    this.contactService.getContacts().subscribe(
      (data) => {
        this.contacts = data;
        this.filteredContacts = data; 
        
      },
      (error) => {
        console.error('Error fetching contacts', error);
      }
    );
  }
  

  async openAddContactModal(): Promise<void> {
    if (this.isBrowser) {
      const bootstrap = await import('bootstrap');
      const modal = new bootstrap.Modal(this.addContactModal.nativeElement);
      modal.show();
    }
  }




 

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredContacts = [...this.contacts]; // If search term is empty, show all contacts
    } else {
      this.filteredContacts = this.contacts.filter(contact => 
        contact.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.phoneNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  navigateToAddContact(): void {
    this.router.navigate(['/dashboard/addcontact']);
  }

  editContact(contactId: number): void {
    
    this.router.navigate([`/dashboard/editcontact/${contactId}`]);
  }


  confirmDelete(contactID: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteContact(contactID);  // Call delete if confirmed
      }
    });
  }


  deleteContact(contactID: number): void {
    if (contactID !== undefined && contactID !== null) {
      this.contactService.deleteContact(contactID).subscribe(
        (response) => {
          console.log('Contact deleted successfully');
          this.contacts = this.contacts.filter(contact => contact.contactID !== contactID);
          Swal.fire('Deleted!', 'Your contact has been deleted.', 'success');
          
        },
        (error) => {
          console.error('Error deleting contact:', error);
          Swal.fire('Error!', 'There was an error deleting the contact.', 'error');
        }
      );
    }
  }


  



}
