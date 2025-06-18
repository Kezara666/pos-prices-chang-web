import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatManagementComponent } from './stat-management.component';

describe('StatManagementComponent', () => {
  let component: StatManagementComponent;
  let fixture: ComponentFixture<StatManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
