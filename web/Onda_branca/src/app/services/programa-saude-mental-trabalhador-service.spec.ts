import { TestBed } from '@angular/core/testing';

import { ProgramaSaudeMentalTrabalhadorService } from './programa-saude-mental-trabalhador-service';

describe('ProgramaSaudeMentalTrabalhadorService', () => {
  let service: ProgramaSaudeMentalTrabalhadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramaSaudeMentalTrabalhadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
