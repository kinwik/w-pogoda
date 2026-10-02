export interface LocationInfo {
  name: string;
  district?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  imageUrl?: string;
  landmark?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  weatherCode: number;
  weatherText: string;
  windSpeed: number; // m/s
  windDirection: number; // degrees
  windGusts: number; // m/s
  surfacePressure: number; // hPa
  pressureMmHg: number; // mmHg
  uvIndex: number;
  precipitation: number; // mm
  isDay: boolean;
  cloudCover: number; // %
}

export interface HourlySlot {
  time: string; // ISO string
  hourFormatted: string; // "14:00"
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  weatherText: string;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string; // "YYYY-MM-DD"
  dayName: string; // "Пн", "Вт", "Сегодня", etc.
  fullDayName: string; // "Понедельник", "Сегодня"
  dateFormatted: string; // "12 окт"
  weatherCode: number;
  weatherText: string;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  windDirection: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  hourlySlots?: HourlySlot[];
}

export interface WeatherData {
  location: LocationInfo;
  current: CurrentWeather;
  hourly: HourlySlot[];
  daily: DailyForecast[];
  updatedAt: string;
}

export type TempUnit = 'C' | 'F';
export type WindUnit = 'ms' | 'kmh';
export type PressureUnit = 'mmHg' | 'hPa';

export interface UserUnits {
  temp: TempUnit;
  wind: WindUnit;
  pressure: PressureUnit;
}
