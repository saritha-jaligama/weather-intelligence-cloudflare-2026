import { TemperatureUnit, WindSpeedUnit } from '../types';

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatRawTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
  }
  return Math.round(celsius * 10) / 10;
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  if (unit === 'mph') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecipitation(mm: number): string {
  if (mm <= 0.05) return '0 mm';
  if (mm < 1) return `${mm.toFixed(1)} mm`;
  return `${Math.round(mm * 10) / 10} mm`;
}

export function getCompassDirection(degrees?: number): string {
  if (degrees === undefined || degrees === null) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function formatLocalTime(timezone: string): string {
  try {
    const now = new Date();
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(now);
  } catch {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

export function formatDayLabel(dateStr: string, index: number): { dayName: string; shortDate: string } {
  if (index === 0) {
    return { dayName: 'Today', shortDate: formatDateStr(dateStr) };
  }
  if (index === 1) {
    return { dayName: 'Tomorrow', shortDate: formatDateStr(dateStr) };
  }
  const date = new Date(dateStr + 'T00:00:00');
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  return { dayName, shortDate };
}

function formatDateStr(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}
