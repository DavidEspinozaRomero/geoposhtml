import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-geolocation',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './geolocation.component.html',
  styleUrl: './geolocation.component.css',
})
export class GeolocationComponent {
  // https://maps.google.com/?q=-0.2309,-78.5211
  googlemapurl?: string;
  message: string = 'Porfavor presiona el boton y activa tu geolocalización';
  position?: GeolocationPosition;
  constructor() {}

  getLocation() {
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.position = position;
          this.getMapUrl();
          resolve(position);
        },
        (error) => {
          console.log(error);
          if (error.code == error.PERMISSION_DENIED) {
            this.message = 'Porfavor activa tu geolocalización';
          } else if (error.code == error.POSITION_UNAVAILABLE) {
            this.message =
              'Nose pudo obtener la geolocalización. Porfavor Renintente';
          } else if (error.code == error.TIMEOUT) {
            this.message = 'El tiempo se acabado. Porfavor Renintente';
          } else {
            this.message = 'Error de geolocalización. Porfavor Renintente';
          }
          reject(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 30000,
        }
      );
    });
  }

  getMapUrl() {
    if (this.position) {
      this.googlemapurl = `https://maps.google.com/?q=${this.position.coords.latitude},${this.position.coords.longitude}`;
    }
  }
}
