// // import { ComponentFixture, TestBed } from '@angular/core/testing';

// // import { AdminUsers } from './admin-users';

// // import { provideHttpClient } from '@angular/common/http';
// // import { provideHttpClientTesting } from '@angular/common/http/testing';
// // import { provideRouter } from '@angular/router';

// // describe('AdminUsers', () => {
// //   let component: AdminUsers;
// //   let fixture: ComponentFixture<AdminUsers>;

// //   beforeEach(async () => {
// //     await TestBed.configureTestingModule({
// //       imports: [AdminUsers],
// //       providers: [provideHttpClient(),
// //       provideHttpClientTesting(),
// //       provideRouter([]),]
// //     })
// //     .compileComponents();

// //     fixture = TestBed.createComponent(AdminUsers);
// //     component = fixture.componentInstance;
// //     fixture.detectChanges();
// //   });

// //   it('should create', () => {
// //     expect(component).toBeTruthy();
// //   });
// // });

// import { TestBed } from '@angular/core/testing';
// import { provideHttpClient } from '@angular/common/http';
// import { provideHttpClientTesting } from '@angular/common/http/testing';
// import { AdminUsers } from './admin-users';

// describe('AdminUsersPage', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AdminUsers], // ✅ standalone component
//       providers: [
//         provideHttpClient(),
//         provideHttpClientTesting(),
//       ],
//     }).compileComponents();
//   });

//   it('should create', () => {
//     const fixture = TestBed.createComponent(AdminUsers);
//     const component = fixture.componentInstance;
//     expect(component).toBeTruthy();
//   });
// });
