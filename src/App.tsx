import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastChart } from './components/ForecastChart';
import { ForecastList } from './components/ForecastList';
import { PlanningAdvisory } from './components/PlanningAdvisory';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorState } from './components/ErrorState';
import { searchCities, fetchWeatherForecast, CityNotFoundError } from './services/openMeteo';
import { GeocodingResult, TemperatureUnit, WeatherData, WindSpeedUnit } from './types';
import { generatePlanningRecommendations } from './utils/recommendations';
import { MapPin, ShieldCheck, ExternalLink, Activity } from 'lucide-react';

const DEFAULT_CITY = 'Chennai';

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentCity, setCurrentCity] = useState<GeocodingResult | null>(null);
  const [alternateLocations, setAlternateLocations] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [lastQuery, setLastQuery] = useState<string>(DEFAULT_CITY);

  const windSpeedUnit: WindSpeedUnit = temperatureUnit === 'celsius' ? 'kmh' : 'mph';

  const performCitySearch = useCallback(async (query: string, specificCity?: GeocodingResult) => {
    const trimmed = query.trim();
    if (!trimmed && !specificCity) return;

    setIsLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      let targetCity = specificCity;

      if (!targetCity) {
        const results = await searchCities(trimmed, 5);
        if (!results || results.length === 0) {
          throw new CityNotFoundError(trimmed);
        }
        targetCity = results[0];
        // Store alternatives if more than 1 result
        setAlternateLocations(results.slice(1, 4));
      } else {
        setAlternateLocations([]);
      }

      const weather = await fetchWeatherForecast(targetCity);
      setCurrentCity(targetCity);
      setWeatherData(weather);
    } catch (err: unknown) {
      if (err instanceof CityNotFoundError) {
        setError(err);
      } else if (err instanceof Error) {
        setError(err);
      } else {
        setError('An unexpected error occurred while fetching weather data.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial mount: load default city (Chennai)
  useEffect(() => {
    performCitySearch(DEFAULT_CITY);
  }, [performCitySearch]);

  const handleToggleUnit = () => {
    setTemperatureUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleRefresh = () => {
    if (currentCity) {
      performCitySearch(currentCity.name, currentCity);
    } else {
      performCitySearch(lastQuery || DEFAULT_CITY);
    }
  };

  const handleReset = () => {
    setError(null);
    performCitySearch(DEFAULT_CITY);
  };

  const recommendations = weatherData
    ? generatePlanningRecommendations(weatherData.current, weatherData.daily[0])
    : null;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        temperatureUnit={temperatureUnit}
        onToggleUnit={handleToggleUnit}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        lastUpdated={weatherData?.lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Search Bar Section */}
        <SearchBar
          onSearch={(query) => performCitySearch(query)}
          onReset={handleReset}
          isLoading={isLoading}
          currentCityName={currentCity?.name}
        />

        {/* Alternate Matching Locations Notice (if ambiguous search) */}
        {alternateLocations.length > 0 && !error && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Multiple matches found:</span>
            {alternateLocations.map((loc) => (
              <button
                key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                type="button"
                onClick={() => performCitySearch(loc.name, loc)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 transition-colors font-medium cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>
                  {loc.name}, {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorState
            error={error}
            onRetry={() => performCitySearch(lastQuery || DEFAULT_CITY)}
            onClear={handleReset}
            onSelectCity={(city) => performCitySearch(city)}
          />
        )}

        {/* Active Weather Dashboard */}
        {!isLoading && !error && weatherData && (
          <div className="space-y-6">
            {/* 1. Current Weather Section */}
            <CurrentWeatherCard
              weatherData={weatherData}
              temperatureUnit={temperatureUnit}
              windSpeedUnit={windSpeedUnit}
            />

            {/* 2. Planning Recommendations Section */}
            {recommendations && <PlanningAdvisory recommendation={recommendations} />}

            {/* 3. Forecast Visualization Chart */}
            <ForecastChart
              days={weatherData.daily}
              temperatureUnit={temperatureUnit}
            />

            {/* 4. 7-Day Daily Forecast Cards */}
            <ForecastList
              days={weatherData.daily}
              temperatureUnit={temperatureUnit}
              windSpeedUnit={windSpeedUnit}
            />
          </div>
        )}
      </main>

      {/* Business Dashboard Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Open-Meteo Public API Integration • Real-Time Weather Intelligence</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Geocoding & Forecast APIs Active</span>
            </div>
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-800 transition-colors"
            >
              <span>open-meteo.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
