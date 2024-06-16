import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
import { FirebaseService } from './services/firebase/firebase.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockFirebaseService: jasmine.SpyObj<FirebaseService>;

  beforeEach(async () => {
    mockFirebaseService = jasmine.createSpyObj('FirebaseService', ['getBooksCount', 'getCategoriesCount']);

    await TestBed.configureTestingModule({
      imports: [RouterOutlet],
      providers: [
        { provide: FirebaseService, useValue: mockFirebaseService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getBooksCount and getCategoriesCount on init', () => {
      expect(mockFirebaseService.getBooksCount).toHaveBeenCalled();
      expect(mockFirebaseService.getCategoriesCount).toHaveBeenCalled();
    });
  })
});
