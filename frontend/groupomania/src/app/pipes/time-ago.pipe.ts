import {
  Pipe,
  PipeTransform,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private timer: number | any;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}
  transform(value: Date) {
    this.removeTimer();
    let d = new Date(value);
    let now = new Date();
    let seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    let timeToUpdate = Number.isNaN(seconds)
      ? 1000
      : this.getSecondsUntilUpdate(seconds) * 1000;
    this.timer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.ngZone.run(() => this.changeDetectorRef.markForCheck());
        }, timeToUpdate);
      }
      return null;
    });
    let minutes = Math.round(Math.abs(seconds / 60));
    let hours = Math.round(Math.abs(minutes / 60));
    let days = Math.round(Math.abs(hours / 24));
    let months = Math.round(Math.abs(days / 30.416));
    let years = Math.round(Math.abs(days / 370));
    if (Number.isNaN(seconds)) {
      return '';
    } else if (seconds <= 59) {
      return 'quelques secondes';
    } else if (seconds <= 119) {
      return '1 minute';
    } else if (minutes <= 59) {
      return minutes + ' minutes';
    } else if (minutes <= 119) {
      return '1 heure';
    } else if (hours <= 23) {
      return hours + ' heures';
    } else if (hours <= 47) {
      return '1 jour';
    } else if (days <= 29) {
      return days + ' jours';
    } else if (days <= 59) {
      return '1 mois';
    } else if (days <= 364) {
      return months + ' mois';
    } else if (days <= 727) {
      return '1 an';
    } else {
      // (days > 727)
      return years + ' ans';
    }
  }
  ngOnDestroy(): void {
    this.removeTimer();
  }
  private removeTimer() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
  private getSecondsUntilUpdate(seconds: number) {
    let min = 60;
    let hr = min * 60;
    let day = hr * 24;
    if (seconds < min) {
      // less than 1 min, update every 2 secs
      return 2;
    } else if (seconds < hr) {
      // less than an hour, update every 30 secs
      return 30;
    } else if (seconds < day) {
      // less then a day, update every 5 mins
      return 300;
    } else {
      // update every hour
      return 3600;
    }
  }
}
