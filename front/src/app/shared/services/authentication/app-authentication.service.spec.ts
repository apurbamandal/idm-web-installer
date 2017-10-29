import { TestBed, inject } from '@angular/core/testing';

import { AppAuthenticationService } from './app-authentication.service';

describe('AppAuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppAuthenticationService]
    });
  });

  it('should be created', inject([AppAuthenticationService], (service: AppAuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
