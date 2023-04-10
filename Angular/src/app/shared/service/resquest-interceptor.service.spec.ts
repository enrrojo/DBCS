import { TestBed } from '@angular/core/testing';

import { ResquestInterceptorService } from './resquest-interceptor.service';

describe('ResquestInterceptorService', () => {
  let service: ResquestInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResquestInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
