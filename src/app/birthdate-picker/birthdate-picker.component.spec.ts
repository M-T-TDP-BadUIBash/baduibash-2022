import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdatePickerComponent } from './birthdate-picker.component';

describe('BirthdatePickerComponent', () => {
  let component: BirthdatePickerComponent;
  let fixture: ComponentFixture<BirthdatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BirthdatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthdatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
