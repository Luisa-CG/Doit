import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageCategoriesPage } from './manage-categories.page';

describe('ManageCategoriesPage', () => {
  let component: ManageCategoriesPage;
  let fixture: ComponentFixture<ManageCategoriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
