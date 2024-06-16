import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

import { authPages, noAuthPages } from '../../../constants/pages.const';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ details: {} }),
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display authPages if token is present in localStorage', () => {
    localStorage.setItem('token', 'some-token');
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.pages).toEqual(authPages);
  });

  it('should display noAuthPages if token is not present in localStorage', () => {
    localStorage.removeItem('token');
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.pages).toEqual(noAuthPages);
  });
});
