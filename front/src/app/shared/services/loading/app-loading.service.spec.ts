import { TestBed, inject } from '@angular/core/testing';

import { AppLoadingService } from './app-loading.service';

describe('AppLoadingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppLoadingService]
    });
  });

  it('should be created', inject([AppLoadingService], (service: AppLoadingService) => {
    expect(service).toBeTruthy();
  }));
});
