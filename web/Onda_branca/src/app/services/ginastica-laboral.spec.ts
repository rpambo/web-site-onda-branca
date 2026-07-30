import { TestBed } from '@angular/core/testing';

import { GinasticaLaboral } from './ginastica-laboral';

describe('GinasticaLaboral', () => {
  let service: GinasticaLaboral;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GinasticaLaboral);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
