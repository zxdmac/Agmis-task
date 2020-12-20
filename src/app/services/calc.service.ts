import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalcService {

  constructor(
  ) { }

  randomCarCoordinates(userCoordinates): {lat: number, lng: number}  {
    let num = 0;
    do {
      // get a number between 100 and 280;
      num = Math.floor(Math.random() * 280) + 1;
    } while (num < 100);
    num *= Math.round(Math.random()) ? 1 : -1;
    num /= 10000; // four decimal places

    return {
        lat: userCoordinates.position.lat + num,
        lng: userCoordinates.position.lng + num
    };
  }

  formatTime(durationInSec): string {
    if (!durationInSec) {return ''; }
    const date = new Date();
    date.setSeconds(date.getSeconds() + durationInSec);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }
}
