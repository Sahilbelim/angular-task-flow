import { TestBed } from '@angular/core/testing';

import { NewTaskService } from './task';

describe('Task', () => {
  let service: NewTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
