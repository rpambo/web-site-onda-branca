import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPalestra } from './form-palestra';

describe('FormPalestra', () => {
  let component: FormPalestra;
  let fixture: ComponentFixture<FormPalestra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPalestra]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPalestra);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
