// // import { TestBed } from '@angular/core/testing';

// // import { Auth } from './auth';

// // describe('Auth', () => {
// //   let service: Auth;

// //   beforeEach(() => {
// //     TestBed.configureTestingModule({});
// //     service = TestBed.inject(Auth);
// //   });

// //   it('should be created', () => {
// //     expect(service).toBeTruthy();
// //   });
// // });


// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ToastrService } from 'ngx-toastr';
// import { Auth } from './auth';

// describe('AuthService', () => {
//   let service: Auth;

//   const toastrMock = {
//     success: jasmine.createSpy(),
//     error: jasmine.createSpy(),
//     info: jasmine.createSpy(),
//     warning: jasmine.createSpy(),
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule, // ✅ fixes _HttpClient
//       ],
//       providers: [
//         { provide: ToastrService, useValue: toastrMock }, // ✅ fixes ToastConfig
//       ],
//     });

//     service = TestBed.inject(Auth);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });
