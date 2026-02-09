// import { TestBed } from '@angular/core/testing';

// import { ProfileService } from './profile';
// describe('Profile', () => {
//   let service: ProfileService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(ProfileService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });
import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  const API =
    'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task/user';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService],
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // 🔥 ensures no pending HTTP calls
  });

  /* =====================================================
     GET PROFILE
  ===================================================== */
  it('should fetch user profile by id', () => {
    const mockUser = {
      id: '1',
      name: 'John',
      email: 'john@test.com',
    };

    service.getProfile('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${API}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUser);
  });

  /* =====================================================
     UPDATE PROFILE
  ===================================================== */
  it('should update profile data', () => {
    const payload = {
      name: 'Updated Name',
      phone: '9999999999',
    };

    service.updateProfile('1', payload).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${API}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);

    req.flush({ success: true });
  });

  /* =====================================================
     CHANGE PASSWORD — SUCCESS
  ===================================================== */
  it('should change password when current password is correct', () => {
    const mockUser = {
      id: '1',
      password: 'old123',
    };

    service
      .changePassword('1', 'old123', 'new123')
      .subscribe(res => {
        expect(res).toBeTruthy();
      });

    // 1️⃣ GET PROFILE
    const getReq = httpMock.expectOne(`${API}/1`);
    expect(getReq.request.method).toBe('GET');
    getReq.flush(mockUser);

    // 2️⃣ UPDATE PASSWORD
    const putReq = httpMock.expectOne(`${API}/1`);
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body).toEqual({
      password: 'new123',
    });

    putReq.flush({ success: true });
  });

  /* =====================================================
     CHANGE PASSWORD — ERROR
  ===================================================== */
  it('should throw error if current password is incorrect', () => {
    const mockUser = {
      id: '1',
      password: 'correctPassword',
    };

    service
      .changePassword('1', 'wrongPassword', 'new123')
      .subscribe({
        next: () => fail('Expected error'),
        error: err => {
          expect(err.message).toBe(
            'Current password is incorrect'
          );
        },
      });

    const req = httpMock.expectOne(`${API}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUser);
  });
});
