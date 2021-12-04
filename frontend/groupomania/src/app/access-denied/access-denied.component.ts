import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
})
export class AccessDeniedComponent implements OnInit {
  remaining: number = 5;
  obsTimer: Observable<number> = timer(900, 1000);

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 5000);

    this.obsTimer.subscribe(() => (this.remaining -= 1));
  }
}
