import React from 'react';
import {
  MapPin,
  Clock,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Compass,
  Gauge,
  Sun,
  Globe2,
} from 'lucide-react';
import { TemperatureUnit, WeatherData, WindSpeedUnit } from '../types';
import {
  formatLocalTime,
  formatPrecipitation,
  formatTemperature,
  formatWindSpeed,
  getCompassDirection,
} from '../utils/formatters';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weatherData,
  temperatureUnit,
  windSpeedUnit,
}) => {
  const { city, current, daily, timezone } = weatherData;
  const weatherInfo = getWeatherCodeInfo(current.weatherCode);
  const todayForecast = daily[0];

  const localTime = formatLocalTime(timezone);
  const compassDir = getCompassDirection(current.windDirection);

  // Humidity comfort index
  let humidityNote = 'Comfortable';
  if (current.relativeHumidity > 70) humidityNote = 'High Humidity';
  else if (current.relativeHumidity < 30) humidityNote = 'Dry Air';

  // Format location string
  const locationHierarchy = [city.admin1, city.country].filter(Boolean).join(', ');

  return (
    <section
      id="current-weather-card"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs overflow-hidden"
    >
      {/* City & Location Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Target Location</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-2.5">
            <h2 id="selected-city-name" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {city.name}
            </h2>
            {locationHierarchy && (
              <span id="selected-location-country" className="text-base sm:text-lg font-medium text-slate-500">
                {locationHierarchy}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Local Time: <strong className="text-slate-700">{localTime}</strong> ({timezone})
              </span>
            </div>
          </div>
        </div>

        {/* High / Low of the day badge */}
        {todayForecast && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 self-start md:self-auto">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Day's Range</div>
              <div className="text-sm font-semibold text-slate-800">
                H: {formatTemperature(todayForecast.tempMax, temperatureUnit)} • L:{' '}
                {formatTemperature(todayForecast.tempMin, temperatureUnit)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Temperature & Condition Showcase */}
      <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
            <WeatherIcon code={current.weatherCode} className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span id="current-temperature" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                {formatTemperature(current.temperature, temperatureUnit)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                id="current-condition-badge"
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${weatherInfo.badgeColor}`}
              >
                {weatherInfo.label}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-slate-400" />
                Feels like <strong className="text-slate-700">{formatTemperature(current.apparentTemperature, temperatureUnit)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Condition Narrative */}
        <div className="max-w-xs text-xs text-slate-600 bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
          <div className="font-semibold text-slate-800 mb-0.5">Atmospheric Condition</div>
          <p className="leading-relaxed">{weatherInfo.description}</p>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t border-slate-100">
        {/* Metric 1: Humidity */}
        <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              Humidity
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">{humidityNote}</span>
          </div>
          <div id="metric-humidity" className="text-xl font-bold text-slate-900">
            {current.relativeHumidity}%
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, current.relativeHumidity))}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Wind Speed & Direction */}
        <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-500" />
              Wind Speed
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-0.5">
              <Compass className="w-3 h-3" />
              {compassDir}
            </span>
          </div>
          <div id="metric-wind-speed" className="text-xl font-bold text-slate-900">
            {formatWindSpeed(current.windSpeed, windSpeedUnit)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {current.windSpeed < 15 ? 'Calm / Gentle' : current.windSpeed < 30 ? 'Moderate breeze' : 'Gusty breeze'}
          </p>
        </div>

        {/* Metric 3: Precipitation */}
        <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span className="flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-indigo-500" />
              Precipitation
            </span>
            {todayForecast && (
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                {todayForecast.precipitationProbability}% chance
              </span>
            )}
          </div>
          <div id="metric-precipitation" className="text-xl font-bold text-slate-900">
            {formatPrecipitation(current.precipitation)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {current.precipitation > 0 ? 'Active precipitation' : 'No ground rain currently'}
          </p>
        </div>

        {/* Metric 4: Barometric Pressure / UV Index */}
        <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-amber-500" />
              Pressure / UV
            </span>
            {todayForecast?.uvIndexMax !== undefined && (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Sun className="w-2.5 h-2.5" />
                UV {Math.round(todayForecast.uvIndexMax)}
              </span>
            )}
          </div>
          <div id="metric-pressure" className="text-xl font-bold text-slate-900">
            {current.surfacePressure ? `${Math.round(current.surfacePressure)} hPa` : '1013 hPa'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {current.surfacePressure && current.surfacePressure > 1015
              ? 'Stable high pressure'
              : 'Standard atmospheric'}
          </p>
        </div>
      </div>
    </section>
  );
};
