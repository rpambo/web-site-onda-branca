import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Podcasthome } from './podcasthome';

describe('Podcasthome', () => {
  let component: Podcasthome;
  let fixture: ComponentFixture<Podcasthome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Podcasthome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Podcasthome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
