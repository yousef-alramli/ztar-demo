import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HomePageRoutingModule } from './home-page-routing.module';

import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { HomePageComponent } from './home-page.component';

@NgModule({
  declarations: [
    HomePageComponent,
  ],
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    HomePageRoutingModule,
  ],
})
export class HomePageModule { }
