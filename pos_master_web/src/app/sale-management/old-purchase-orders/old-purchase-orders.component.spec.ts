import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldPurchaseOrdersComponent } from './old-purchase-orders.component';

describe('OldPurchaseOrdersComponent', () => {
  let component: OldPurchaseOrdersComponent;
  let fixture: ComponentFixture<OldPurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldPurchaseOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldPurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
