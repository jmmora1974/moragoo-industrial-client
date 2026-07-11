import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalProvidersComponent } from './modal-providers.component';

describe('ModalProvidersComponent', () => {
  let component: ModalProvidersComponent;
  let fixture: ComponentFixture<ModalProvidersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalProvidersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
