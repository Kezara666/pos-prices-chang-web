import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QtyTypesComponent } from './qty-types.component';

describe('QtyTypesComponent', () => {
  let component: QtyTypesComponent;
  let fixture: ComponentFixture<QtyTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QtyTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QtyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
