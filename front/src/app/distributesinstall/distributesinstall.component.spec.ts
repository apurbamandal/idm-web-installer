import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributesinstallComponent } from './distributesinstall.component';

describe('DistributesinstallComponent', () => {
  let component: DistributesinstallComponent;
  let fixture: ComponentFixture<DistributesinstallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributesinstallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributesinstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
