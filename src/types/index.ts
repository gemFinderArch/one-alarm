export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
}

export interface AlarmTimes {
  sunrise: Date;
  brahmaMuhurta: Date;
  sleepTime: Date;
}

export interface AlarmState {
  enabled: boolean;
  location: LocationData | null;
  alarmTimes: AlarmTimes | null;
}

export enum StorageKeys {
  LOCATION = 'one-alarm:location',
  ALARM_ENABLED = 'one-alarm:alarm-enabled',
}
