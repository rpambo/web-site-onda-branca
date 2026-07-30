import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEvntos } from './form-evntos';

describe('FormEvntos', () => {
  let component: FormEvntos;
  let fixture: ComponentFixture<FormEvntos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEvntos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEvntos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
