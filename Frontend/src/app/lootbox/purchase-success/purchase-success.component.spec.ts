import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSuccessComponent } from './purchase-success.component';

describe('PurchaseSuccessComponent', () => {
  let component: PurchaseSuccessComponent;
  let fixture: ComponentFixture<PurchaseSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
