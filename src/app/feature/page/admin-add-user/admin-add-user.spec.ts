// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { AdminAddUser } from './admin-add-user';

// describe('AdminAddUser', () => {
//   let component: AdminAddUser;
//   let fixture: ComponentFixture<AdminAddUser>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AdminAddUser]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(AdminAddUser);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminAddUser } from './admin-add-user';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { ToastrService } from 'ngx-toastr';

describe('AdminAddUser', () => {
  let component: AdminAddUser;
  let fixture: ComponentFixture<AdminAddUser>;

  const apiServiceMock = {
    createUser: jasmine.createSpy(),
  };

  const toastrMock = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy(),
    info: jasmine.createSpy(),
    warning: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddUser],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAddUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
