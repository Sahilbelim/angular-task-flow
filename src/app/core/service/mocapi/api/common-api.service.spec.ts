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
        httpMock.verify();
    });

    /* =====================================================
       GET — LIST
       Should call GET /tasks
    ===================================================== */
    it('should fetch list of tasks', () => {

        const mock = [{ id: '1', title: 'Task' }];

        service.get<any[]>('tasks').subscribe(res => {
            expect(res).toEqual(mock);
        });

        const req = httpMock.expectOne(`${API}/tasks`);
        expect(req.request.method).toBe('GET');

        req.flush(mock);
    });

    /* =====================================================
       GET — SINGLE BY ID
       Should convert id to REST path
       /tasks/5 instead of ?id=5
    ===================================================== */
    it('should fetch single task by id', () => {

        const mock = { id: '5', title: 'Single Task' };

        service.get<any>('tasks', { id: 5 }).subscribe(res => {
            expect(res).toEqual(mock);
        });

        const req = httpMock.expectOne(`${API}/tasks/5`);
        expect(req.request.method).toBe('GET');

        req.flush(mock);
    });

    /* =====================================================
       GET — QUERY PARAMS
       Should attach params to URL
    ===================================================== */
    it('should send query params', () => {

        service.get<any[]>('tasks', { status: 'pending', page: 2 }).subscribe();

        const req = httpMock.expectOne(r =>
            r.url === `${API}/tasks` &&
            r.params.get('status') === 'pending' &&
            r.params.get('page') === '2'
        );

        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    /* =====================================================
       POST — CREATE
    ===================================================== */
    it('should create record using POST', () => {

        const body = { title: 'New Task' };

        service.post('tasks', body).subscribe(res => {
            expect(res).toEqual(body);
        });

        const req = httpMock.expectOne(`${API}/tasks`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(body);

        req.flush(body);
    });

    /* =====================================================
       PUT — UPDATE
    ===================================================== */
    it('should update record using PUT', () => {

        const body = { title: 'Updated' };

        service.put('tasks', 10, body).subscribe(res => {
            expect(res).toEqual(body);
        });

        const req = httpMock.expectOne(`${API}/tasks/10`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(body);

        req.flush(body);
    });

    /* =====================================================
       DELETE — REMOVE
    ===================================================== */
    it('should delete record using DELETE', () => {

        service.delete('tasks', 9).subscribe();

        const req = httpMock.expectOne(`${API}/tasks/9`);
        expect(req.request.method).toBe('DELETE');

        req.flush({});
    });

    // /* =====================================================
    //    EXTERNAL API CALL
    //    Should call full external URL (no base API)
    // ===================================================== */
    // it('should call external API', () => {

    //     const externalUrl = 'https://restcountries.com/v3.1/all?fields=name';

    //     service.external<any[]>(externalUrl).subscribe();

    //     const req = httpMock.expectOne(externalUrl);
    //     expect(req.request.method).toBe('GET');

    //     req.flush([]);
    // });

});
