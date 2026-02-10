import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { ApiService } from './core/service/mocapi/api/api';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Header } from './shared/component/header/header';

/* ===============================
   MOCK HEADER (NO TOASTR)
================================ */
@Component({
  selector: 'app-header',
  standalone: true,
  template: '',
})
class MockHeader { }

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  const apiMock = {
    overlayOpen$: of(false),
    loadUserFromStorage: jasmine.createSpy(),
    getCurrentUser: jasmine.createSpy().and.returnValue(of(null)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        MockHeader,
        RouterTestingModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiMock },
      ],
    })
      // 🔥 THIS IS THE KEY FIX
      .overrideComponent(App, {
        remove: { imports: [Header] },
        add: { imports: [MockHeader] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
