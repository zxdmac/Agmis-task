import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {MapService} from './map.service';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private map: MapService) { }

  getGeoLocation(): Observable<any> {
    return new Observable(obs => {
      navigator.geolocation.getCurrentPosition(
        success => {
          obs.next(success);
          obs.complete();
        },
        error => {
          obs.error(error);
        }
      );
    });
  }

  addUserMarker(): Observable<any> {
    return new Observable(obs => {
      this.getGeoLocation().subscribe(data => {
        const marker = {
          position: {
            lat: data.coords.latitude,
            lng: data.coords.longitude,
          },
          draggable: true,
          iconUrl: ''
        };
        obs.next(this.map.addMarkerToMarkers(marker));
      });
    });
  }

}
