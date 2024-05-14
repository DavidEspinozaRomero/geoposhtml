import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  // URLs
  getGoogleMapUrl(geo: { latitude: number; longitude: number }) {
    const googlemapurl = `https://maps.google.com/?q=${geo.latitude},${geo.longitude}`;
    return googlemapurl;
  }

  // Forms
  isValidControl(form: FormGroup, name: string) {
    return form.get(name)?.errors && form.get(name)?.touched;
  }
}
