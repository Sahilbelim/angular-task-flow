import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post';
import { Post } from '../models/post.model';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should fetch all posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 },
    ]
    service.getPost().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(mockPosts);
    })

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');

    expect(req.request.method).toBe('GET');

    req.flush(mockPosts);

  })

  it("should fetch post by id", () => {
    const mockPost: Post = { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 }

    service.getPostById(1).subscribe(post => {
      expect(post).toEqual(mockPost);
    })

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  })

  it("should update post", () => {
    const mockPost: Post = { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 };

    service.updatePost(1, mockPost).subscribe(post => {
      expect(post).toEqual(mockPost);
    })

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockPost);
  })

  it("should delete post", () => {
     
  
    service.deletePostById(1).subscribe(post => {
      expect(post).toBeTruthy();
    })

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});

  })
  
});
