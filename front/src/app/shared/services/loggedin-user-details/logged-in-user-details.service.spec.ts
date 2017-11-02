import {TestBed, inject} from '@angular/core/testing';

import {LoggedInUserDetailsService} from './logged-in-user-details.service';

describe('LoggedInUserDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedInUserDetailsService]
    });
  });

  it('should be created', inject([LoggedInUserDetailsService], (service: LoggedInUserDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
