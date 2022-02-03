import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MVPComponent } from './mvp.component';

describe('MVPComponent', () => {
  let component: MVPComponent;
  let fixture: ComponentFixture<MVPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MVPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MVPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
