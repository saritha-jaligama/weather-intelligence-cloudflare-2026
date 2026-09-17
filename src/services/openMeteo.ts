import { DailyForecastDay, GeocodingResponse, GeocodingResult, WeatherData } from '../types';
import { formatDayLabel } from '../utils/formatters';

export class CityNotFoundError extends Error {
  constructor(public cityQuery: string) {
    super(`City not found: "${cityQuery}". Please check the spelling or try searching another city.`);
    this.name = 'CityNotFoundError';
  }
}

export class WeatherApiError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Converts a city name into geocoding results (latitude, longitude, country, etc.)
 */
export async function searchCities(query: string, count = 5): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=${count}&language=en&format=json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new WeatherApiError(`Geocoding service returned HTTP status ${response.status}`);
    }

    const data: GeocodingResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new CityNotFoundError(trimmed);
    }

    return data.results;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof CityNotFoundError) {
      throw err;
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new WeatherApiError('Search request timed out. Please check your internet connection and try again.');
    }
    if (err instanceof WeatherApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'Unknown network error';
    throw new WeatherApiError(`Failed to reach Open-Meteo geocoding service (${message}). Please try again.`, err);
  }
}

/**
 * Retrieves current weather and 7-day forecast using latitude and longitude.
 */
export async function fetchWeatherForecast(city: GeocodingResult): Promise<WeatherData> {
  const { latitude, longitude } = city;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new WeatherApiError(`Forecast service returned HTTP status ${response.status}`);
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new WeatherApiError('Incomplete weather payload received from Open-Meteo.');
    }

    // Process daily forecast
    const dailyTimes: string[] = data.daily.time || [];
    const dailyDays: DailyForecastDay[] = dailyTimes.slice(0, 7).map((dateStr, index) => {
      const { dayName, shortDate } = formatDayLabel(dateStr, index);
      return {
        date: dateStr,
        dayName,
        formattedDate: shortDate,
        weatherCode: data.daily.weather_code?.[index] ?? 0,
        tempMax: data.daily.temperature_2m_max?.[index] ?? 0,
        tempMin: data.daily.temperature_2m_min?.[index] ?? 0,
        apparentTempMax: data.daily.apparent_temperature_max?.[index],
        apparentTempMin: data.daily.apparent_temperature_min?.[index],
        precipitationProbability: data.daily.precipitation_probability_max?.[index] ?? 0,
        precipitationSum: data.daily.precipitation_sum?.[index] ?? 0,
        windSpeedMax: data.daily.wind_speed_10m_max?.[index] ?? 0,
        uvIndexMax: data.daily.uv_index_max?.[index] ?? 0,
      };
    });

    const weatherData: WeatherData = {
      city,
      current: {
        time: data.current.time,
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        relativeHumidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        surfacePressure: data.current.surface_pressure,
      },
      daily: dailyDays,
      timezone: data.timezone || 'UTC',
      elevation: data.elevation,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    return weatherData;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new WeatherApiError('Weather forecast request timed out. Please check your internet connection.');
    }
    if (err instanceof WeatherApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'Unknown network error';
    throw new WeatherApiError(`Could not fetch forecast data (${message}). Please try again.`, err);
  }
}
