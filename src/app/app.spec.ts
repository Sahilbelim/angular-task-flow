// import { Component } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { App } from './app';
// import { ApiService } from './core/service/mocapi/api/api';
// import { RouterTestingModule } from '@angular/router/testing';
// import { of } from 'rxjs';
// import { Header } from './shared/component/header/header';

// /* ===============================
//    MOCK HEADER (NO TOASTR)
// ================================ */
// @Component({
//   selector: 'app-header',
//   standalone: true,
//   template: '',
// })
// class MockHeader { }

// describe('App', () => {
//   let component: App;
//   let fixture: ComponentFixture<App>;

//   const apiMock = {
//     overlayOpen$: of(false),
//     loadUserFromStorage: jasmine.createSpy(),
//     getCurrentUser: jasmine.createSpy().and.returnValue(of(null)),
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         App,
//         MockHeader,
//         RouterTestingModule,
//       ],
//       providers: [
//         { provide: ApiService, useValue: apiMock },
//       ],
//     })
//       // 🔥 THIS IS THE KEY FIX
//       .overrideComponent(App, {
//         remove: { imports: [Header] },
//         add: { imports: [MockHeader] },
//       })
//       .compileComponents();

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
import { BehaviorSubject, of } from 'rxjs';
import { Header } from './shared/component/header/header';

/* ===============================
   MOCK HEADER (no dependencies)
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

  let overlay$: BehaviorSubject<boolean>;
  let apiMock: any;

  beforeEach(async () => {

    overlay$ = new BehaviorSubject<boolean>(false);

    apiMock = {
      overlayOpen$: overlay$.asObservable(),
      initializeApp: jasmine.createSpy().and.returnValue(of(true)),
    };

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
      .overrideComponent(App, {
        remove: { imports: [Header] },
        add: { imports: [MockHeader] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  /* =====================================================
     CREATE
  ===================================================== */

  it('should create app', () => {
    expect(component).toBeTruthy();
  });

  /* =====================================================
     INITIALIZE APP
  ===================================================== */

  it('should set appReady after initializeApp resolves', () => {
    expect(apiMock.initializeApp).toHaveBeenCalled();
    expect(component.appReady).toBeTrue();
  });

  /* =====================================================
     OVERLAY LISTENER
  ===================================================== */

  it('should react to overlay changes', () => {

    overlay$.next(true);
    fixture.detectChanges();

    expect(component.isOverlayOpen).toBeTrue();

    overlay$.next(false);
    fixture.detectChanges();

    expect(component.isOverlayOpen).toBeFalse();
  });

  /* =====================================================
     CLEANUP
  ===================================================== */

  it('should complete destroy$ on destroy', () => {
    const nextSpy = spyOn<any>(component['destroy$'], 'next');
    const completeSpy = spyOn<any>(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});
