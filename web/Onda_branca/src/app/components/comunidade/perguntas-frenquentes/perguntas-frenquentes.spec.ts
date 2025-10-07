import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntasFrenquentes } from './perguntas-frenquentes';

describe('PerguntasFrenquentes', () => {
  let component: PerguntasFrenquentes;
  let fixture: ComponentFixture<PerguntasFrenquentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerguntasFrenquentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerguntasFrenquentes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
