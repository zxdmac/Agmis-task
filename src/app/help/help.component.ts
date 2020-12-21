import { Component, OnInit } from '@angular/core';
import {MapService} from '../services/map.service';
import {CalcService} from '../services/calc.service';
import {GeolocationService} from '../services/geolocation.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  time: string;

  constructor(
    private map: MapService,
    private calc: CalcService,
    private geo: GeolocationService) { }

  ngOnInit(): void {
    this.time = '';
    this.map.durationObs$
      .subscribe(duration => {
        this.time = this.calc.formatTime(duration);
      });

    if (!this.map.getMarkers().length) {
      this.geo.addUserMarker().subscribe(_ => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  initialize(): void {
    this.map.setCarCoord();
    this.map.setCenterBetweenTwoMarkers();
    this.map.calculateRoute();
    this.map.moveMarker();
  }
}
