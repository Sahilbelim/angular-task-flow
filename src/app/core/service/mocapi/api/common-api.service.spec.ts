import { TestBed } from '@angular/core/testing';
import { CommonApiService } from './common-api.service';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';

describe('CommonApiService', () => {

    let service: CommonApiService;
    let httpMock: HttpTestingController;

    const API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CommonApiService]
        });

        service = TestBed.inject(CommonApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify(); // ensure no pending requests
    });

    it('should fetch user by id', () => {
        const mockUser = { id: '2', name: 'Alex' };

        service.getUserById('2').subscribe(res => {
            expect(res).toEqual(mockUser);
        });

        const req = httpMock.expectOne(`${API}/user/2`);
        expect(req.request.method).toBe('GET');

        req.flush(mockUser);
    });

    it('should create user', () => {
        const body = { name: 'New User' };

        service.createUser(body).subscribe(res => {
            expect(res).toEqual(body);
        });

        const req = httpMock.expectOne(`${API}/user`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(body);

        req.flush(body);
    });
    it('should update user', () => {
        const body = { name: 'Updated' };

        service.updateUser(1, body).subscribe(res => {
            expect(res).toEqual(body);
        });

        const req = httpMock.expectOne(`${API}/user/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(body);

        req.flush(body);
    });
    it('should delete user', () => {
        service.deleteUser(5).subscribe(res => {
            expect(res).toBeTruthy();
        });

        const req = httpMock.expectOne(`${API}/user/5`);
        expect(req.request.method).toBe('DELETE');

        req.flush({});
    });
    it('should fetch tasks', () => {
        const mockTasks = [{ id: '1', title: 'Task' }];

        service.getTasks().subscribe(res => {
            expect(res).toEqual(mockTasks);
        });

        const req = httpMock.expectOne(`${API}/tasks`);
        expect(req.request.method).toBe('GET');

        req.flush(mockTasks);
    });
    it('should create task', () => {
        const body = { title: 'New Task' };

        service.createTask(body).subscribe(res => {
            expect(res).toEqual(body);
        });

        const req = httpMock.expectOne(`${API}/tasks`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(body);

        req.flush(body);
    });
    it('should update task', () => {
        const body = { title: 'Updated Task' };

        service.updateTask(3, body).subscribe(res => {
            expect(res).toEqual(body);
        });

        const req = httpMock.expectOne(`${API}/tasks/3`);
        expect(req.request.method).toBe('PUT');

        req.flush(body);
    });
    it('should delete task', () => {
        service.deleteTask(9).subscribe(res => {
            expect(res).toBeTruthy();
        });

        const req = httpMock.expectOne(`${API}/tasks/9`);
        expect(req.request.method).toBe('DELETE');

        req.flush({});
    });
    it('should fetch countries', () => {
        const mock = [{ name: { common: 'India' } }];

        service.getCountries().subscribe(res => {
            expect(res).toEqual(mock);
        });

        const req = httpMock.expectOne(
            'https://restcountries.com/v3.1/all?fields=name'
        );

        expect(req.request.method).toBe('GET');

        req.flush(mock);
    });
});
