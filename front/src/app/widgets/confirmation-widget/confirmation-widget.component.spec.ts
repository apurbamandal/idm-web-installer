import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationWidgetComponent } from './confirmation-widget.component';

describe('ConfirmationWidgetComponent', () => {
  let component: ConfirmationWidgetComponent;
  let fixture: ComponentFixture<ConfirmationWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
