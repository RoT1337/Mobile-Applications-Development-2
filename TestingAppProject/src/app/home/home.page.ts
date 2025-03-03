import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor() {}

  image: string | null = null;
  location: any;

  // Camera ---

  async takePicture(){
    const img = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.image = img.dataUrl ?? null;
  }

  async pickFromGallery(){
    const img = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    this.image = img.webPath ?? null;
  }

  /// ---
  /// Geolocation

  async checkPermissions() {
    const permissionStatus = await Geolocation.checkPermissions();
    console.log('Permission Status', permissionStatus);

    if (permissionStatus.location === 'denied') {
      const newPermissions = await Geolocation.requestPermissions();
      console.log('New Permissions', newPermissions);
    }
  }
  
  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current Position', coordinates);

      // Long and Lat
      const { latitude, longitude } = coordinates.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    } catch (error) {
      console.error('Error getting current position', error);
    }
  }

  watchLocation() {
    Geolocation.watchPosition({}, (position, err) => {
      if (err) {
        console.error('Error watching position', err);
        return;
      } 
      console.log('Watched Position:', position);
    }).then(watchId => {
      // Optional stop watch after some time
      setTimeout(() => {
        Geolocation.clearWatch({ id: watchId });
      }, 10000); // 10 Seconds
    });
  }
}
