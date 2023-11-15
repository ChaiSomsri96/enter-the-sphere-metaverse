import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCompletedComponent } from './purchase-completed.component';

describe('PurchaseCompletedComponent', () => {
  let component: PurchaseCompletedComponent;
  let fixture: ComponentFixture<PurchaseCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
