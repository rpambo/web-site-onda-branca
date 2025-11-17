import { TestBed } from '@angular/core/testing';

import { EmailMarketing } from './email-marketing';

describe('EmailMarketing', () => {
  let service: EmailMarketing;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailMarketing);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
