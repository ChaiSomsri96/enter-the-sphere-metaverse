import { TestBed } from '@angular/core/testing';

import { CardspageService } from './cardspage.service';

describe('CardspageService', () => {
  let service: CardspageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardspageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
