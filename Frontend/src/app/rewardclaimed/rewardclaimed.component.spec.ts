import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardclaimedComponent } from './rewardclaimed.component';

describe('RewardclaimedComponent', () => {
  let component: RewardclaimedComponent;
  let fixture: ComponentFixture<RewardclaimedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardclaimedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardclaimedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
