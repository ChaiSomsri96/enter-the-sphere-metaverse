import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBundleComponent } from './open-bundle.component';

describe('OpenBundleComponent', () => {
  let component: OpenBundleComponent;
  let fixture: ComponentFixture<OpenBundleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenBundleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenBundleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
