// import { TestBed } from '@angular/core/testing';

// import { NewTaskService } from './newtask';

// describe('Newtask', () => {
//   let service: NewTaskService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(NewTaskService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NewTaskService } from './newtask';

describe('NewTaskService', () => {
  let service: NewTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // ✅ provides HttpClient
      ],
    });

    service = TestBed.inject(NewTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
