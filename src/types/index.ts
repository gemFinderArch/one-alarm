export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
}

export interface AlarmTimes {
  sunrise: Date;
  sunset: Date;
  brahmaMuhurta: Date;
  godhuliKaalReminderTime: Date;
  godhuliKaalTime: Date;
  pradoshaKaalReminderTime: Date;
  pradoshaKaalTime: Date;
}

export interface AlarmState {
  location: LocationData | null;
  alarmTimes: AlarmTimes | null;
}

export enum StorageKeys {
  LOCATION = 'one-alarm:location',
  ALARM_ENABLED = 'one-alarm:alarm-enabled',
  AUTO_UPDATE = 'one-alarm:auto-update',
  LAST_SYNCED = 'one-alarm:last-synced',
}

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};
