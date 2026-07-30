import { TestBed } from '@angular/core/testing';

import { QualidadeDeVida } from './qualidade-de-vida';

describe('QualidadeDeVida', () => {
  let service: QualidadeDeVida;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualidadeDeVida);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
