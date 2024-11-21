import { TestBed } from '@angular/core/testing';

import { ContatctService } from './contatct.service';

describe('ContatctService', () => {
  let service: ContatctService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContatctService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
