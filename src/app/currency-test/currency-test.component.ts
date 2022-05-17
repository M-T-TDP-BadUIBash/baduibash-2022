import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-currency-test',
  templateUrl: './currency-test.component.html',
  styleUrls: ['./currency-test.component.scss']
})
export class CurrencyTestComponent implements OnInit {
  submitted = false;
  personalInfoExpanded = true;
  jobHistoryExpanded = true;
  educationExpanded = true;
  templateExpanded = true;

  constructor() { }

  ngOnInit(): void {
  }

}
