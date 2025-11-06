import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reclamacao } from './reclamacao';

describe('Reclamacao', () => {
  let component: Reclamacao;
  let fixture: ComponentFixture<Reclamacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reclamacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reclamacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
