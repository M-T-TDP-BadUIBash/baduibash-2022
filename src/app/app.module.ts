import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResumeComponent } from './resume/resume.component';
import { CurrencyTestComponent } from './currency-test/currency-test.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BirthdatePickerComponent } from './birthdate-picker/birthdate-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    ResumeComponent,
    CurrencyTestComponent,
    NavbarComponent,
    BirthdatePickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: 'currency', component: CurrencyTestComponent },
      { path: 'resume', component: ResumeComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
