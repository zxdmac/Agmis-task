import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MapService} from '../services/map.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @Output() mapDragend = new EventEmitter();

  center: any[] = null;
  markers: Array<{position: google.maps.LatLng, draggable: boolean, iconUrl: string}>;

  constructor(private map: MapService) { }

  ngOnInit(): void {
    this.markers = this.map.getMarkers();

    this.map.centerObs$
      .subscribe(serviceCenter => {
        this.center = serviceCenter;
      });
  }

  dragEnd(event: google.maps.MouseEvent) {
    const newUserPositionValue = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
    };
    this.map.updateMarker(0, 'position', newUserPositionValue);
  }

}
