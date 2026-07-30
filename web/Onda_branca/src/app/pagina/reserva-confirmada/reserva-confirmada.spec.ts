import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaConfirmada } from './reserva-confirmada';

describe('ReservaConfirmada', () => {
  let component: ReservaConfirmada;
  let fixture: ComponentFixture<ReservaConfirmada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaConfirmada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaConfirmada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
