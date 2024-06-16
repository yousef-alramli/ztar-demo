import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { mockFirebaseService } from '../../services/firebase/firebase-service.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  const firebaseService = mockFirebaseService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, FooterComponent],
      providers: [
        { provide: FirebaseService, useValue: firebaseService },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ details: {} }),
          }
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the home page component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the FirebaseService instance', () => {
    expect(component.firebaseService).toBeTruthy();
  });
});