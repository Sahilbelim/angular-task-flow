// // import { ComponentFixture, TestBed } from '@angular/core/testing';

// // import { TaskComponent } from './tasks';

// // import { provideHttpClient } from '@angular/common/http';
// // import { provideHttpClientTesting } from '@angular/common/http/testing';
// // import { provideRouter } from '@angular/router';


// // describe('Tasks', () => {
// //   let component: TaskComponent;
// //   let fixture: ComponentFixture<TaskComponent>;

// //   beforeEach(async () => {
// //     await TestBed.configureTestingModule({
// //       imports: [TaskComponent],
// //       providers: [provideHttpClient(),
// //       provideHttpClientTesting(),
// //       provideRouter([]),]
// //     })
// //     .compileComponents();

// //     fixture = TestBed.createComponent(TaskComponent);
// //     component = fixture.componentInstance;
// //     fixture.detectChanges();
// //   });

// //   it('should create', () => {
// //     expect(component).toBeTruthy();
// //   });
// // });


// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { TaskComponent } from './tasks';
// import { provideHttpClient } from '@angular/common/http';
// import { provideHttpClientTesting } from '@angular/common/http/testing';
// import { provideRouter } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';

// describe('Tasks', () => {
//   let component: TaskComponent;
//   let fixture: ComponentFixture<TaskComponent>;

//   const toastrMock = {
//     success: jasmine.createSpy('success'),
//     error: jasmine.createSpy('error'),
//     info: jasmine.createSpy('info'),
//     warning: jasmine.createSpy('warning'),
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [TaskComponent], // standalone
//       providers: [
//         provideHttpClient(),
//         provideHttpClientTesting(),
//         provideRouter([]),

//         // ✅ FIX: mock toastr
//         { provide: ToastrService, useValue: toastrMock },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(TaskComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
