import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Contact } from '../contact';


@Injectable({
  providedIn: 'root'
})
export class ContatctService {

  private apiUrl = 'https://localhost:44383/api/Contacts';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact, { headers: this.getAuthHeaders() });
  }

  getContactById(contactId: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${contactId}`, { headers: this.getAuthHeaders() });
  }

  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${contact.contactID}`, contact, { headers: this.getAuthHeaders() });
  }

  deleteContact(contactId: number): Observable<null> {
    return this.http.delete<null>(`${this.apiUrl}/${contactId}`, { headers: this.getAuthHeaders() });
  }


  
}
