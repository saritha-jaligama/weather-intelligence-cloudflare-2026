import React from 'react';
import { Calendar, Droplets, Wind } from 'lucide-react';
import { DailyForecastDay, TemperatureUnit, WindSpeedUnit } from '../types';
import { formatPrecipitation, formatTemperature, formatWindSpeed } from '../utils/formatters';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface ForecastListProps {
  days: DailyForecastDay[];
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
}

export const ForecastList: React.FC<ForecastListProps> = ({
  days,
  temperatureUnit,
  windSpeedUnit,
}) => {
  if (!days || days.length === 0) return null;

  // Global min and max across all 7 days for proportional bar visualization
  const allMax = Math.max(...days.map((d) => d.tempMax));
  const allMin = Math.min(...days.map((d) => d.tempMin));
  const totalRange = Math.max(allMax - allMin, 1);

  return (
    <section id="forecast-list-section" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">7-Day Extended Forecast</h3>
        </div>
        <span className="text-xs text-slate-500">Daily Outlook & Probability</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {days.map((day, index) => {
          const info = getWeatherCodeInfo(day.weatherCode);
          const isToday = index === 0;

          // Bar offset calculation
          const leftPercent = Math.max(0, ((day.tempMin - allMin) / totalRange) * 100);
          const widthPercent = Math.max(15, ((day.tempMax - day.tempMin) / totalRange) * 100);

          return (
            <div
              key={day.date}
              id={`forecast-day-card-${index}`}
              className={`rounded-xl p-3.5 flex flex-col justify-between border transition-all ${
                isToday
                  ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-300/60 shadow-xs'
                  : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/80'
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold tracking-tight ${
                      isToday ? 'text-blue-700' : 'text-slate-800'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  {isToday && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-600 text-white">
                      Today
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">{day.formattedDate}</div>
              </div>

              {/* Weather Icon & Condition */}
              <div className="my-3 flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center mb-1.5">
                  <WeatherIcon code={day.weatherCode} className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-slate-700 line-clamp-1" title={info.label}>
                  {info.label}
                </span>
              </div>

              {/* High / Low Temperatures */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    {formatTemperature(day.tempMax, temperatureUnit)}
                  </span>
                  <span className="font-medium text-slate-500">
                    {formatTemperature(day.tempMin, temperatureUnit)}
                  </span>
                </div>

                {/* Range Bar Indicator */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full relative overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                    }}
                  />
                </div>

                {/* Rain Probability & Wind */}
                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 font-medium">
                  <span
                    className={`inline-flex items-center gap-0.5 ${
                      day.precipitationProbability >= 30 ? 'text-blue-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    <Droplets className="w-3 h-3" />
                    {day.precipitationProbability}%
                  </span>

                  <span className="inline-flex items-center gap-0.5 text-slate-400">
                    <Wind className="w-3 h-3" />
                    {formatWindSpeed(day.windSpeedMax, windSpeedUnit)}
                  </span>
                </div>

                {day.precipitationSum > 0 && (
                  <div className="text-[10px] text-blue-700 bg-blue-50 rounded px-1 text-center font-medium">
                    {formatPrecipitation(day.precipitationSum)} rain
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
