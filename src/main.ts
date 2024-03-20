import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

if (!navigator.geolocation) {
  alert('La Geolocation no es soportada en este navegador');
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
