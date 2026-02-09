// import { TestBed } from '@angular/core/testing';
// import { App } from './app';
// import { RouterTestingModule } from '@angular/router/testing';
// describe('App', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [App, RouterTestingModule],
//     }).compileComponents();
//   });

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(App);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   // it('should render title', () => {
//   //   const fixture = TestBed.createComponent(App);
//   //   fixture.detectChanges();
//   //   const compiled = fixture.nativeElement as HTMLElement;
//   //   expect(compiled.querySelector('h1')?.textContent).toContain('Hello, task-manager');
//   // });

  
// });


// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { App } from './app';
// import { ApiService } from './core/service/mocapi/api/api';
// import { RouterTestingModule } from '@angular/router/testing';
// import { of } from 'rxjs';

// describe('App', () => {
//   let component: App;
//   let fixture: ComponentFixture<App>;

//   const apiMock = {
//     overlayOpen$: of(false),
//     loadUserFromStorage: jasmine.createSpy(),
//     getCurrentUser: jasmine.createSpy().and.returnValue(of(null)),
//     user: jasmine.createSpy().and.returnValue(null), // ✅ FIX
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         App,
//         RouterTestingModule, // router-outlet safe
//       ],
//       providers: [
//         { provide: ApiService, useValue: apiMock },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(App);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the app', () => {
//     expect(component).toBeTruthy();
//   });
// });


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
