import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesComponent } from '../categories.component';
import { CategoryData } from '../../../types/firestoreData.types';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  const categoryData: CategoryData = {
    id: 'category1',
    value: 'Category 1'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
  });

  it('should create the categories component', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedCategory when onCategorySelect is called with a category', () => {
    component.onCategorySelect(categoryData);
    expect(component.selectedCategory).toEqual(categoryData);
  });

  it('should clear selectedCategory when onCategorySelect is called with undefined', () => {
    component.onCategorySelect(undefined);
    expect(component.selectedCategory).toBeUndefined();
  });
});
