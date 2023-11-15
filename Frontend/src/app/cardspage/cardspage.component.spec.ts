import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardspageComponent } from './cardspage.component';

describe('CardspageComponent', () => {
  let component: CardspageComponent;
  let fixture: ComponentFixture<CardspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
