import { TestBed } from '@angular/core/testing';

import { CanalDeReclamacao } from './canal-de-reclamacao';

describe('CanalDeReclamacao', () => {
  let service: CanalDeReclamacao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanalDeReclamacao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
