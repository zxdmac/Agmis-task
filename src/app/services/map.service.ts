import { Injectable } from '@angular/core';
import {Loader} from '@googlemaps/js-api-loader';
import {BehaviorSubject, Observable} from 'rxjs';
import {CalcService} from './calc.service';
import {Router} from '@angular/router';

interface Position {
  lat: number;
  lng: number;
}

interface Marker {
  position: google.maps.LatLng;
  draggable: boolean;
  iconUrl: string;
}


@Injectable({
  providedIn: 'root'
})
export class MapService {
  markers: Array<Marker> = [];
  routeCoordinates: object = {lat: 0, lng: 0};
  routeCoordinatesLength = 0;
  carCoord: Position;
  routeCoordinateIndex = 0;
  duration = 0;

  private serviceCenter: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
  public serviceCenter$: Observable<any[]> = this.serviceCenter.asObservable();

  private observableDuration: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
  public observableDuration$: Observable<any[]> = this.observableDuration.asObservable();

  constructor(
    private calc: CalcService,
    private router: Router) { }

  updateServiceCenter(updatedCenter): void {
    this.serviceCenter.next(updatedCenter);
  }

  updateObservableDuration(updatedDuration): void {
    this.observableDuration.next(updatedDuration);
  }

  moveMarker(): void {
    const moverID = setInterval(() => {
      if (this.routeCoordinateIndex === this.routeCoordinatesLength || this.router.url !== '/help') {
        clearInterval(moverID);
      }
      if (this.markers[1]) {
        this.markers[1].position = this.routeCoordinates[this.routeCoordinateIndex];
        this.routeCoordinateIndex++;
      }
    }, 1000);
  }

  addMarkerToMarkers(latLngLit): void {
    this.markers.push(latLngLit);
  }

  getMarkers(): Marker[] {
    return this.markers;
  }

  updateMarker(index, prop, value): void {
    this.markers[index][prop] = value;
  }

  updateDraggable(index, boolVal): void {
    this.markers[index].draggable = boolVal;
  }

  destroyAllMarkers(): void {
    this.markers = [];
  }

  twoCoordinatesCenter(markers): Position {
    const latCenter = (markers[0].position.lat + markers[1].position.lat) / 2;
    const lngCenter = (markers[0].position.lng + markers[1].position.lng) / 2;
    return { lat: latCenter, lng: lngCenter };
  }

  calculateRoute(): void {
    const originCoordinates = this.markers[1].position;
    const destinationCoordinates = this.markers[0].position;
    const loader = new Loader({
      apiKey: 'AIzaSyBh2OfVfsrc6om-DPSFtUUmPMrgu3iQ-1k',
      version: 'weekly',
      libraries: ['places']
    });
    loader.load().then(() => {
      const directionsService = new google.maps.DirectionsService();
      const mode = 'DRIVING';

      directionsService.route(
        {
          origin: originCoordinates,
          destination: destinationCoordinates,
          travelMode: google.maps.TravelMode[mode],
        }, (response, status) => {
          if (status === 'OK') {
            this.extractCoordinates(response);
            this.extractDuration(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
    });
  }

  extractCoordinates(response): void {
    const overviewPath = response.routes[0].overview_path;
    const coords: object = {};

    for (const [key, coord] of overviewPath.entries()) {
        coords[key] = {
          lat: coord.lat(),
          lng: coord.lng()
        };
    }

    this.routeCoordinates = coords;
    this.routeCoordinatesLength = Object.keys(coords).length;
  }

  extractDuration(response): void {
    this.duration = response.routes[0].legs[0].duration.value;
    this.updateObservableDuration(this.duration);
  }

  setCarCoord(): void {
    const userCoordinates = this.getMarkers()[0];
    this.carCoord = this.calc.randomCarCoordinates(userCoordinates);
    this.addMarkerToMarkers({
      position: this.carCoord,
      draggable: false,
      iconUrl: '../assets/help.png'
    });
    this.updateDraggable(0, false);
  }

  setCenterBetweenTwoMarkers(): void {
    const center = this.twoCoordinatesCenter(this.getMarkers());
    this.updateServiceCenter(center);
  }

}
