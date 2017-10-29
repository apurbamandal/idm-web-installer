import { TestBed, inject } from '@angular/core/testing';

import { DocumentRefService } from './document-ref.service';

describe('DocumentRefService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentRefService]
    });
  });

  it('should be created', inject([DocumentRefService], (service: DocumentRefService) => {
    expect(service).toBeTruthy();
  }));
});
