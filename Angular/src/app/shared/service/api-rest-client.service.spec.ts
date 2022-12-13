import { TestBed } from '@angular/core/testing';

import { ApiRestClientService } from './api-rest-client.service';

describe('ApiRestClientService', () => {
  let service: ApiRestClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRestClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
