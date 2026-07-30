import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaInvalida } from './reserva-invalida';

describe('ReservaInvalida', () => {
  let component: ReservaInvalida;
  let fixture: ComponentFixture<ReservaInvalida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaInvalida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaInvalida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
