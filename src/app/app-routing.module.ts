import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeecontactsComponent } from './employeecontacts/employeecontacts.component';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { AddcontactComponent } from './addcontact/addcontact.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  
  
  {
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: '', component: EmployeecontactsComponent },
      { path: 'contactlist', component: ContactlistComponent }, 
      { path: 'addcontact', component: AddcontactComponent },  
      { path: 'editcontact/:id', component: EditContactComponent },  
      { path: '', redirectTo: 'contactlist', pathMatch: 'full' },  
    ]
    
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
