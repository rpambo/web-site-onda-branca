import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P7Mentoria } from './p7-mentoria';

describe('P7Mentoria', () => {
  let component: P7Mentoria;
  let fixture: ComponentFixture<P7Mentoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P7Mentoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P7Mentoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
