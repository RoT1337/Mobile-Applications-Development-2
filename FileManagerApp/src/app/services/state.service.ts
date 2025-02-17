import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor() {}

  async setState(key: string, value: any) {
    await Preferences.set({ key, value: JSON.stringify(value) });
  }

  async getState(key: string) {
    const result = await Preferences.get({ key });
    return result.value ? JSON.parse(result.value) : null;
  }

  async removeState(key: string) {
    await Preferences.remove({ key });
  }
}
