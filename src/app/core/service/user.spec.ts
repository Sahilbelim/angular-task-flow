// // import { TestBed } from '@angular/core/testing';

// // import { UserService } from './user';

// // describe('User', () => {
// //   let service: UserService;

// //   beforeEach(() => {
// //     TestBed.configureTestingModule({});
// //     service = TestBed.inject(UserService);
// //   });

// //   it('should be created', () => {
// //     expect(service).toBeTruthy();
// //   });
// // });

// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { UserService } from './user';
// import { Auth } from '../auth/auth';

// describe('UserService', () => {
//   let service: UserService;

//   const authServiceMock = {
//     getToken: jasmine.createSpy().and.returnValue('fake-token'),
//     logout: jasmine.createSpy(),
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule, // ✅ HttpClient
//       ],
//       providers: [
//         UserService,
//         { provide: Auth, useValue: authServiceMock }, // ✅ MOCK
//       ],
//     });

//     service = TestBed.inject(UserService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user';

describe('UserService', () => {
  let service: UserService;

  const toastrMock = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy(),
    info: jasmine.createSpy(),
    warning: jasmine.createSpy(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ToastrService, useValue: toastrMock }, // ✅
      ],
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
