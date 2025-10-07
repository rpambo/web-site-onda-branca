import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoComunidade } from './contacto-comunidade';

describe('ContactoComunidade', () => {
  let component: ContactoComunidade;
  let fixture: ComponentFixture<ContactoComunidade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactoComunidade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoComunidade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
