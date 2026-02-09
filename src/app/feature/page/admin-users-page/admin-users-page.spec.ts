// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { AdminUsersPage } from './admin-users-page';
// import { UserService } from '../../../core/service/user';
// import { AuthService } from '../../../core/service/auth.service';
// import { ToastrService } from 'ngx-toastr';

// describe('AdminUsersPage', () => {
//   let component: AdminUsersPage;
//   let fixture: ComponentFixture<AdminUsersPage>;

//   const userServiceMock = {
//     getUsers: jasmine.createSpy().and.returnValue([]),
//     createUser: jasmine.createSpy(),
//     deleteUser: jasmine.createSpy(),
//     updateUser: jasmine.createSpy(),
//   };

//   const authServiceMock = {
//     isLoggedIn: jasmine.createSpy().and.returnValue(true),
//     user: jasmine.createSpy().and.returnValue({ role: 'admin' }),
//   };

//   const toastrMock = jasmine.createSpyObj('ToastrService', [
//     'success',
//     'error',
//     'info',
//     'warning',
//   ]);

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AdminUsersPage], // ✅ standalone component
//       providers: [
//         { provide: UserService, useValue: userServiceMock },
//         { provide: AuthService, useValue: authServiceMock },
//         { provide: ToastrService, useValue: toastrMock },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(AdminUsersPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
