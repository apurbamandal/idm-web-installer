import {TestBed, inject} from '@angular/core/testing';

import {DefaultRequestOptionsService} from './default-request-options.service';

describe('DefaultRequestOptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefaultRequestOptionsService]
    });
  });

  it('should be created', inject([DefaultRequestOptionsService], (service: DefaultRequestOptionsService) => {
    expect(service).toBeTruthy();
  }));
});
