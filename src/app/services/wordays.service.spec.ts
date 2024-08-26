import { TestBed } from '@angular/core/testing';

import { WordaysService } from './wordays.service';

describe('WordaysService', () => {
  let service: WordaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
