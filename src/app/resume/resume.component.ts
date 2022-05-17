import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  submitted : boolean = false;

  onSubmit(): void {
    this.submitted = true;
  }

  testing(): void {
    console.log("test");
  }

  ngOnInit(): void {
  }

}
