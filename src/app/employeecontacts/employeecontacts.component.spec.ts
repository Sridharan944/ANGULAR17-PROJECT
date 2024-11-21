import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeecontactsComponent } from './employeecontacts.component';

describe('EmployeecontactsComponent', () => {
  let component: EmployeecontactsComponent;
  let fixture: ComponentFixture<EmployeecontactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeecontactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeecontactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
