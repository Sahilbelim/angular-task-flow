// // // import { TestBed } from '@angular/core/testing';

// // // import { UserService } from './user';

// // // describe('User', () => {
// // //   let service: UserService;

// // //   beforeEach(() => {
// // //     TestBed.configureTestingModule({});
// // //     service = TestBed.inject(UserService);
// // //   });

// // //   it('should be created', () => {
// // //     expect(service).toBeTruthy();
// // //   });
// // // });

// // import { TestBed } from '@angular/core/testing';
// // import { provideHttpClient } from '@angular/common/http';
// // import { provideHttpClientTesting } from '@angular/common/http/testing';
// // import { UserService } from './user';

// // describe('UserService', () => {
// //   let service: UserService;

// //   beforeEach(() => {
// //     TestBed.configureTestingModule({
// //       providers: [
// //         UserService,
// //         provideHttpClient(),
// //         provideHttpClientTesting(),
// //       ],
// //     });

// //     service = TestBed.inject(UserService);
// //   });

// //   it('should be created', () => {
// //     expect(service).toBeTruthy();
// //   });
// // });

// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { UserService } from './user';

// describe('UserService', () => {
//   let service: UserService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule, // ✅ REQUIRED
//       ],
//       providers: [
//         UserService, // optional but explicit
//       ],
//     });

//     service = TestBed.inject(UserService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });
  