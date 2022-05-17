import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyTestComponent } from './currency-test.component';

describe('CurrencyTestComponent', () => {
  let component: CurrencyTestComponent;
  let fixture: ComponentFixture<CurrencyTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
