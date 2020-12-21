import { Component, OnInit } from '@angular/core';
import {GeolocationService} from '../services/geolocation.service';
import {MapService} from '../services/map.service';

@Component({
  selector: 'app-pick-location',
  templateUrl: './pick-location.component.html',
  styleUrls: ['./pick-location.component.css']
})
export class PickLocationComponent implements OnInit {

  constructor(
    private geo: GeolocationService,
    private map: MapService
  ) { }

  ngOnInit(): void {
    this.map.destroyAllMarkers();

    this.geo.addUserMarker().subscribe(_ => {
      this.map.updateCenter(this.map.getMarkers()[0].position);
    });
  }
}
