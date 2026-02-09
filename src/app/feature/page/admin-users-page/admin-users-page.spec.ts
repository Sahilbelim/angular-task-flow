// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { AdminUsersPage } from './admin-users-page';

// describe('AdminUsersPage', () => {
//   let component: AdminUsersPage;
//   let fixture: ComponentFixture<AdminUsersPage>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AdminUsersPage]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(AdminUsersPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsersPage } from './admin-users-page';
import { UserService } from '../../../core/service/user';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';

describe('AdminUsersPage', () => {
  let component: AdminUsersPage;
  let fixture: ComponentFixture<AdminUsersPage>;

  const userServiceMock = {
    getUsers: jasmine.createSpy().and.returnValue([]),
  };

  const authServiceMock = {
    isLoggedIn: jasmine.createSpy().and.returnValue(true),
  };

  const toastrMock = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy(),
    info: jasmine.createSpy(),
    warning: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsersPage],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
