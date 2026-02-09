// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { Dashbord } from './dashbord';

// describe('Dashbord', () => {
//   let component: Dashbord;
//   let fixture: ComponentFixture<Dashbord>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [Dashbord, HttpClientTestingModule]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(Dashbord);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Dashbord } from './dashbord';
import { ToastrService } from 'ngx-toastr';

describe('Dashbord', () => {
  let component: Dashbord;
  let fixture: ComponentFixture<Dashbord>;

  const toastrMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    info: jasmine.createSpy('info'),
    warning: jasmine.createSpy('warning'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Dashbord,
        HttpClientTestingModule,
      ],
      providers: [
        // ✅ FIX: mock toastr
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashbord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
