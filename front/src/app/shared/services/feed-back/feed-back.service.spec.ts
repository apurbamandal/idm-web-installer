import { TestBed, inject } from '@angular/core/testing';

import { FeedBackService } from './feed-back.service';

describe('FeedBackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeedBackService]
    });
  });

  it('should be created', inject([FeedBackService], (service: FeedBackService) => {
    expect(service).toBeTruthy();
  }));
});
