import { TestBed, inject } from '@angular/core/testing';

import { AppContextService } from './app-context.service';

describe('AppContextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppContextService]
    });
  });

  it('should be created', inject([AppContextService], (service: AppContextService) => {
    expect(service).toBeTruthy();
  }));
});
