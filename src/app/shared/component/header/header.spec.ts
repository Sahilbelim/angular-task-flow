// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Header } from './header';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { ToastrService } from 'ngx-toastr';
// import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';

// describe('Header', () => {
//   let component: Header;
//   let fixture: ComponentFixture<Header>;
//   let router: Router;

//   let apiMock: jasmine.SpyObj<ApiService>;
//   let toastrMock: jasmine.SpyObj<ToastrService>;

//   beforeEach(async () => {
//     apiMock = jasmine.createSpyObj<ApiService>('ApiService', [
//       'logout',
//       'user',
//     ]);

//     toastrMock = jasmine.createSpyObj<ToastrService>('ToastrService', [
//       'success',
//     ]);

//     await TestBed.configureTestingModule({
//       imports: [
//         Header, // ✅ standalone component
//         RouterTestingModule.withRoutes([]), // ✅ REQUIRED
//       ],
//       providers: [
//         { provide: ApiService, useValue: apiMock },
//         { provide: ToastrService, useValue: toastrMock },
//       ],
//     }).compileComponents();

//     router = TestBed.inject(Router);
//   });

//   function createComponent() {
//     fixture = TestBed.createComponent(Header);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   }

//   /* =====================================================
//      BASIC
//   ===================================================== */

//   it('should create', () => {
//     apiMock.user.and.returnValue(null);
//     createComponent();

//     expect(component).toBeTruthy();
//   });

//   /* =====================================================
//      AUTH STATE
//   ===================================================== */

//   it('should set isLoggedIn = false when no user', () => {
//     apiMock.user.and.returnValue(null);
//     createComponent();

//     expect(component.isLoggedIn).toBeFalse();
//     expect(component.user).toBeNull();
//   });

//   it('should set isLoggedIn = true when user exists', () => {
//     const mockUser = { id: '1', name: 'John' };
//     apiMock.user.and.returnValue(mockUser);
//     createComponent();

//     expect(component.isLoggedIn).toBeTrue();
//     expect(component.user).toEqual(mockUser);
//   });

//   /* =====================================================
//      MENU TOGGLES
//   ===================================================== */

//   it('should toggle main menu', () => {
//     apiMock.user.and.returnValue(null);
//     createComponent();

//     expect(component.menuOpen).toBeFalse();

//     component.toggleMenu();
//     expect(component.menuOpen).toBeTrue();

//     component.toggleMenu();
//     expect(component.menuOpen).toBeFalse();
//   });

//   it('should toggle user menu', () => {
//     apiMock.user.and.returnValue(null);
//     createComponent();

//     expect(component.userMenuOpen).toBeFalse();

//     component.toggleUserMenu();
//     expect(component.userMenuOpen).toBeTrue();

//     component.toggleUserMenu();
//     expect(component.userMenuOpen).toBeFalse();
//   });

//   it('should close all menus', () => {
//     apiMock.user.and.returnValue(null);
//     createComponent();

//     component.menuOpen = true;
//     component.userMenuOpen = true;

//     component.closeMenus();

//     expect(component.menuOpen).toBeFalse();
//     expect(component.userMenuOpen).toBeFalse();
//   });

//   /* =====================================================
//      ROUTE CHANGE
//   ===================================================== */

//   it('should close menus on route change', async () => {
//     apiMock.user.and.returnValue(null);
//     createComponent();

//     component.menuOpen = true;
//     component.userMenuOpen = true;

//     // ✅ REAL router navigation (NO manual events)
//     // await router.navigateByUrl('/test');
//     await router.navigateByUrl('/');
//     expect(component.menuOpen).toBeFalse();
//     expect(component.userMenuOpen).toBeFalse();
//   });

//   /* =====================================================
//      LOGOUT
//   ===================================================== */

//   it('should logout and show success toast', () => {
//     apiMock.user.and.returnValue({ id: '1' });
//     createComponent();

//     component.logout();

//     expect(apiMock.logout).toHaveBeenCalled();
//     expect(toastrMock.success).toHaveBeenCalledWith('Logout successful');
//   });
  
  
// });

// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { Header } from './header';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { ToastrService } from 'ngx-toastr';
// import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';

// describe('Header', () => {

//   let component: Header;
//   let fixture: ComponentFixture<Header>;
//   let router: Router;

//   let apiMock: any;
//   let toastrMock: any;

//   beforeEach(async () => {

//     apiMock = {
//       currentUser: jasmine.createSpy(),
//       logout: jasmine.createSpy(),
//     };

//     toastrMock = jasmine.createSpyObj('ToastrService', ['success']);

//     await TestBed.configureTestingModule({
//       imports: [
//         Header,
//         RouterTestingModule.withRoutes([]),
//       ],
//       providers: [
//         { provide: ApiService, useValue: apiMock },
//         { provide: ToastrService, useValue: toastrMock },
//       ],
//     }).compileComponents();

//     router = TestBed.inject(Router);
//   });

//   function create() {
//     fixture = TestBed.createComponent(Header);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   }

//   /* =====================================================
//      BASIC
//   ===================================================== */

//   it('should create', () => {
//     apiMock.currentUser.and.returnValue(null);
//     create();
//     expect(component).toBeTruthy();
//   });

//   /* =====================================================
//      AUTH STATE (SIGNAL EFFECT)
//   ===================================================== */

//   it('should detect logged out state', () => {
//     apiMock.currentUser.and.returnValue(null);
//     create();

//     expect(component.isLoggedIn).toBeFalse();
//     expect(component.user).toBeNull();
//   });

//   it('should detect logged in state', () => {
//     const user = { id: '1', name: 'John' };
//     apiMock.currentUser.and.returnValue(user);
//     create();

//     expect(component.isLoggedIn).toBeTrue();
//     expect(component.user).toEqual(user);
//   });

//   /* =====================================================
//      MENU TOGGLES
//   ===================================================== */

//   it('should toggle menu', () => {
//     apiMock.currentUser.and.returnValue(null);
//     create();

//     component.toggleMenu();
//     expect(component.menuOpen).toBeTrue();

//     component.toggleMenu();
//     expect(component.menuOpen).toBeFalse();
//   });

//   it('should toggle user menu', () => {
//     apiMock.currentUser.and.returnValue(null);
//     create();

//     component.toggleUserMenu();
//     expect(component.userMenuOpen).toBeTrue();

//     component.toggleUserMenu();
//     expect(component.userMenuOpen).toBeFalse();
//   });

//   it('should close menus', () => {
//     apiMock.currentUser.and.returnValue(null);
//     create();

//     component.menuOpen = true;
//     component.userMenuOpen = true;

//     component.closeMenus();

//     expect(component.menuOpen).toBeFalse();
//     expect(component.userMenuOpen).toBeFalse();
//   });

//   /* =====================================================
//      ROUTE CHANGE REACTION
//   ===================================================== */

//   it('should close menus on navigation', fakeAsync(() => {
//     apiMock.currentUser.and.returnValue(null);
//     create();

//     component.menuOpen = true;
//     component.userMenuOpen = true;

//     router.navigateByUrl('/test');
//     tick();

//     expect(component.menuOpen).toBeFalse();
//     expect(component.userMenuOpen).toBeFalse();
//   }));

//   /* =====================================================
//      LOGOUT
//   ===================================================== */

//   it('should logout and show toast', () => {
//     apiMock.currentUser.and.returnValue({ id: '1' });
//     create();

//     component.logout();

//     expect(apiMock.logout).toHaveBeenCalled();
//     expect(toastrMock.success).toHaveBeenCalledWith('Logout successful');
//   });

// });


import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Header } from './header';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

/* =====================================================
   DUMMY ROUTE COMPONENT
   Required so router navigation succeeds
===================================================== */
@Component({ template: '' })
class DummyComponent { }

describe('Header', () => {

  let component: Header;
  let fixture: ComponentFixture<Header>;
  let router: Router;

  let apiMock: any;
  let toastrMock: any;

  beforeEach(async () => {

    apiMock = {
      currentUser: jasmine.createSpy(),
      logout: jasmine.createSpy(),
    };

    toastrMock = jasmine.createSpyObj('ToastrService', ['success']);

    await TestBed.configureTestingModule({
      imports: [
        Header,
        RouterTestingModule.withRoutes([
          { path: 'test', component: DummyComponent } // 🔥 IMPORTANT FIX
        ]),
      ],
      providers: [
        { provide: ApiService, useValue: apiMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  function create() {
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  /* =====================================================
     BASIC
  ===================================================== */

  it('should create', () => {
    apiMock.currentUser.and.returnValue(null);
    create();
    expect(component).toBeTruthy();
  });

  /* =====================================================
     AUTH STATE (SIGNAL EFFECT)
  ===================================================== */

  it('should detect logged out state', () => {
    apiMock.currentUser.and.returnValue(null);
    create();

    expect(component.isLoggedIn).toBeFalse();
    expect(component.user).toBeNull();
  });

  it('should detect logged in state', () => {
    const user = { id: '1', name: 'John' };
    apiMock.currentUser.and.returnValue(user);
    create();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.user).toEqual(user);
  });

  /* =====================================================
     MENU TOGGLES
  ===================================================== */

  it('should toggle menu', () => {
    apiMock.currentUser.and.returnValue(null);
    create();

    component.toggleMenu();
    expect(component.menuOpen).toBeTrue();

    component.toggleMenu();
    expect(component.menuOpen).toBeFalse();
  });

  it('should toggle user menu', () => {
    apiMock.currentUser.and.returnValue(null);
    create();

    component.toggleUserMenu();
    expect(component.userMenuOpen).toBeTrue();

    component.toggleUserMenu();
    expect(component.userMenuOpen).toBeFalse();
  });

  it('should close menus', () => {
    apiMock.currentUser.and.returnValue(null);
    create();

    component.menuOpen = true;
    component.userMenuOpen = true;

    component.closeMenus();

    expect(component.menuOpen).toBeFalse();
    expect(component.userMenuOpen).toBeFalse();
  });

  /* =====================================================
     ROUTE CHANGE REACTION
  ===================================================== */

  it('should close menus on navigation', fakeAsync(() => {
    apiMock.currentUser.and.returnValue(null);
    create();

    component.menuOpen = true;
    component.userMenuOpen = true;

    router.navigateByUrl('/test');
    tick();

    expect(component.menuOpen).toBeFalse();
    expect(component.userMenuOpen).toBeFalse();
  }));

  /* =====================================================
     LOGOUT
  ===================================================== */

  it('should logout and show toast', () => {
    apiMock.currentUser.and.returnValue({ id: '1' });
    create();

    component.logout();

    expect(apiMock.logout).toHaveBeenCalled();
    expect(toastrMock.success).toHaveBeenCalledWith('Logout successful');
  });

});
