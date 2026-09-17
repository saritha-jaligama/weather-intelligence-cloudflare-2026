import React from 'react';
import { CloudSun, RefreshCw, Compass } from 'lucide-react';
import { TemperatureUnit } from '../types';

interface HeaderProps {
  temperatureUnit: TemperatureUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated?: string;
}

export const Header: React.FC<HeaderProps> = ({
  temperatureUnit,
  onToggleUnit,
  onRefresh,
  isLoading,
  lastUpdated,
}) => {
  return (
    <header id="app-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shadow-xs">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Weather Intelligence</h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Live Open-Meteo
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Operational meteorology & planning advisory for business and general travel
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unit Toggle */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs font-medium text-slate-700">
            <button
              id="unit-celsius-btn"
              type="button"
              onClick={temperatureUnit === 'fahrenheit' ? onToggleUnit : undefined}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                temperatureUnit === 'celsius'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Display temperature in Celsius"
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              type="button"
              onClick={temperatureUnit === 'celsius' ? onToggleUnit : undefined}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                temperatureUnit === 'fahrenheit'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Display temperature in Fahrenheit"
            >
              °F
            </button>
          </div>

          {/* Refresh Button */}
          <button
            id="refresh-weather-btn"
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh current weather data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Last updated timestamp indicator */}
          {lastUpdated && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 pl-2 border-l border-slate-200">
              <Compass className="w-3.5 h-3.5" />
              <span>Synced {lastUpdated}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
