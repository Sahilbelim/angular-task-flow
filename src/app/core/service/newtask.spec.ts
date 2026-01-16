import { TestBed } from '@angular/core/testing';

import { Newtask } from './newtask';

describe('Newtask', () => {
  let service: Newtask;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Newtask);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
