import { TestBed } from '@angular/core/testing';

import { ProgramaSaudeMentalTrabalhadorServiceSete } from './programa-saude-mental-trabalhador-service-sete';

describe('ProgramaSaudeMentalTrabalhadorServiceSete', () => {
  let service: ProgramaSaudeMentalTrabalhadorServiceSete;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramaSaudeMentalTrabalhadorServiceSete);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
