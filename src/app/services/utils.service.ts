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

  // Time
  getDiffTime(startTimestamp: number, endTimestamp: number): string {
    let diffMiliseconds = endTimestamp - startTimestamp;
    let message = '';

    const types = {
      h: 1000 * 60 * 60,
      m: 1000 * 60,
      s: 1000,
    };

    Object.entries(types).forEach(([key, value]) => {
      if (diffMiliseconds >= value) {
        const diff = Math.floor(diffMiliseconds / value);
        diffMiliseconds = diffMiliseconds % value;
        if (message.length > 0) message += ', ';
        message += `${diff}${key}`;
      }
    });

    return message;
  }

  // Forms
  isValidControl(form: FormGroup, name: string) {
    return form.get(name)?.errors && form.get(name)?.touched;
  }
}
