import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParceiroCliente } from './parceiro-cliente';

describe('ParceiroCliente', () => {
  let component: ParceiroCliente;
  let fixture: ComponentFixture<ParceiroCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParceiroCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParceiroCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
