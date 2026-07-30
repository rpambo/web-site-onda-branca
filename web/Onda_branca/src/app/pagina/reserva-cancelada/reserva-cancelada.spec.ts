import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaCancelada } from './reserva-cancelada';

describe('ReservaCancelada', () => {
  let component: ReservaCancelada;
  let fixture: ComponentFixture<ReservaCancelada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaCancelada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaCancelada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
