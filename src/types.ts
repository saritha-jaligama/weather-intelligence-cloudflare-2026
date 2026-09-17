export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection?: number;
  surfacePressure?: number;
}

export interface DailyForecastDay {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax?: number;
  apparentTempMin?: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax?: number;
}

export interface WeatherData {
  city: GeocodingResult;
  current: CurrentWeatherData;
  daily: DailyForecastDay[];
  timezone: string;
  elevation?: number;
  lastUpdated: string;
}

export interface WeatherRecommendation {
  outdoorStatus: 'favorable' | 'moderate' | 'unfavorable';
  outdoorTitle: string;
  outdoorDescription: string;
  umbrellaNeeded: boolean;
  umbrellaTitle: string;
  umbrellaDescription: string;
  clothingTitle: string;
  clothingItems: string[];
  clothingDescription: string;
  environmentalNotice?: {
    type: 'heat' | 'cold' | 'wind' | 'uv' | 'storm' | 'normal';
    severity: 'low' | 'medium' | 'high';
    title: string;
    description: string;
  };
  businessAdvisory: string;
}
