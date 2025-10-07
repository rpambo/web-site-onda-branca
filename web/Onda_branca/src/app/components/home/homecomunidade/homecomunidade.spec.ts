import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homecomunidade } from './homecomunidade';

describe('Homecomunidade', () => {
  let component: Homecomunidade;
  let fixture: ComponentFixture<Homecomunidade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homecomunidade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homecomunidade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
