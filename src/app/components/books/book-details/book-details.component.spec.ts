import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BookDetailsComponent } from './book-details.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { BookData } from '../../../types/firestoreData.types';

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;

  const mockBookDetails: BookData = {
    category: 'Test Category',
    id: '1',
    numberOfBooks: 5,
    Publisher: 'Test publisher',
    title: 'Test Book',
    year: 1992,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        HeaderComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ details: mockBookDetails }),
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set bookDetails', () => {
      expect(component.bookDetails).toEqual(mockBookDetails);
    });

  });

  describe('details form', () => {
    it('should render book title in the template', () => {
      const compiled = fixture.nativeElement;

      expect(compiled.querySelector('.title').textContent).toContain('Test Book');
      expect(compiled.querySelector('.publisher').textContent).toContain('Test publisher');
      expect(compiled.querySelector('.year').textContent).toContain(1992);
    });
  } );
});