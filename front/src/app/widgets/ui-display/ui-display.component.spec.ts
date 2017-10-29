import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDisplayComponent } from './ui-display.component';

describe('UiDisplayComponent', () => {
  let component: UiDisplayComponent;
  let fixture: ComponentFixture<UiDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
