import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPage } from './user';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('User', () => {
  let component: UsersPage;
  let fixture: ComponentFixture<UsersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersPage],
      providers: [provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
