import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OndaBrancaRadioSolidaria } from './onda-branca-radio-solidaria';

describe('OndaBrancaRadioSolidaria', () => {
  let component: OndaBrancaRadioSolidaria;
  let fixture: ComponentFixture<OndaBrancaRadioSolidaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OndaBrancaRadioSolidaria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OndaBrancaRadioSolidaria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
