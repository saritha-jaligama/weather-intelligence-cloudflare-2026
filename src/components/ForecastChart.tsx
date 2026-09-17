import React, { useState } from 'react';
import { TrendingUp, CloudRain, Info } from 'lucide-react';
import { DailyForecastDay, TemperatureUnit } from '../types';
import { formatRawTemperature, formatTemperature } from '../utils/formatters';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

interface ForecastChartProps {
  days: DailyForecastDay[];
  temperatureUnit: TemperatureUnit;
}

type ChartView = 'temperature' | 'precipitation';

export const ForecastChart: React.FC<ForecastChartProps> = ({ days, temperatureUnit }) => {
  const [view, setView] = useState<ChartView>('temperature');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!days || days.length === 0) return null;

  // Compute scale boundaries for temperatures
  const rawHighs = days.map((d) => formatRawTemperature(d.tempMax, temperatureUnit));
  const rawLows = days.map((d) => formatRawTemperature(d.tempMin, temperatureUnit));

  const minTemp = Math.floor(Math.min(...rawLows) - 2);
  const maxTemp = Math.ceil(Math.max(...rawHighs) + 2);
  const tempRange = Math.max(maxTemp - minTemp, 6);

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    return paddingLeft + (index / (days.length - 1)) * chartWidth;
  };

  const getYTemp = (tempVal: number) => {
    const ratio = (tempVal - minTemp) / tempRange;
    return paddingTop + chartHeight - ratio * chartHeight;
  };

  // Build SVG paths for temperature
  const highPoints = rawHighs.map((val, idx) => ({ x: getX(idx), y: getYTemp(val), val }));
  const lowPoints = rawLows.map((val, idx) => ({ x: getX(idx), y: getYTemp(val), val }));

  const highPath = highPoints.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );
  const lowPath = lowPoints.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );

  // Shaded area between high and low
  const areaPath =
    highPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '') +
    lowPoints
      .slice()
      .reverse()
      .reduce((acc, p) => `${acc} L ${p.x} ${p.y}`, '') +
    ' Z';

  return (
    <section
      id="forecast-chart-section"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs"
    >
      {/* Chart Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">7-Day Meteorological Trend</h3>
            <span className="text-xs text-slate-400 hidden sm:inline">Daily Forecast Visualization</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {view === 'temperature'
              ? 'High vs. low temperature trajectory across the upcoming 7 days'
              : 'Daily precipitation probability and rain accumulation forecast'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs font-medium text-slate-700 self-start sm:self-auto">
          <button
            id="chart-view-temp-btn"
            type="button"
            onClick={() => setView('temperature')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              view === 'temperature'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            <span>Temperature</span>
          </button>
          <button
            id="chart-view-precip-btn"
            type="button"
            onClick={() => setView('precipitation')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              view === 'precipitation'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-blue-600" />
            <span>Precipitation</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative pt-4 w-full overflow-x-auto">
        <div className="min-w-[580px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="tempAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="precipBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = paddingTop + ratio * chartHeight;
              return (
                <line
                  key={ratio}
                  x1={paddingLeft - 10}
                  y1={y}
                  x2={svgWidth - paddingRight + 10}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Temperature View */}
            {view === 'temperature' && (
              <g id="temp-chart-layer">
                {/* Envelope Area Fill */}
                <path d={areaPath} fill="url(#tempAreaGradient)" />

                {/* High Temperature Line */}
                <path
                  d={highPath}
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Low Temperature Line */}
                <path
                  d={lowPath}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="5 3"
                />

                {/* Data Points and Value Badges */}
                {days.map((day, idx) => {
                  const hp = highPoints[idx];
                  const lp = lowPoints[idx];
                  const isHovered = hoveredIndex === idx;

                  return (
                    <g
                      key={day.date}
                      className="cursor-pointer transition-transform"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Vertical highlight guide */}
                      {isHovered && (
                        <line
                          x1={hp.x}
                          y1={paddingTop - 10}
                          x2={hp.x}
                          y2={paddingTop + chartHeight + 10}
                          stroke="#94a3b8"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* High Point Circle */}
                      <circle
                        cx={hp.x}
                        cy={hp.y}
                        r={isHovered ? 6 : 4.5}
                        fill="#fff"
                        stroke="#ea580c"
                        strokeWidth="2.5"
                      />
                      {/* High Value Text */}
                      <text
                        x={hp.x}
                        y={hp.y - 10}
                        textAnchor="middle"
                        fill="#9a3412"
                        fontSize="11"
                        fontWeight="700"
                      >
                        {formatTemperature(day.tempMax, temperatureUnit)}
                      </text>

                      {/* Low Point Circle */}
                      <circle
                        cx={lp.x}
                        cy={lp.y}
                        r={isHovered ? 5.5 : 4}
                        fill="#fff"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />
                      {/* Low Value Text */}
                      <text
                        x={lp.x}
                        y={lp.y + 16}
                        textAnchor="middle"
                        fill="#1e40af"
                        fontSize="10.5"
                        fontWeight="600"
                      >
                        {formatTemperature(day.tempMin, temperatureUnit)}
                      </text>

                      {/* X-Axis Day Labels */}
                      <text
                        x={hp.x}
                        y={paddingTop + chartHeight + 28}
                        textAnchor="middle"
                        fill={isHovered ? '#0f172a' : '#64748b'}
                        fontSize="11"
                        fontWeight={isHovered ? '700' : '500'}
                      >
                        {day.dayName}
                      </text>
                      <text
                        x={hp.x}
                        y={paddingTop + chartHeight + 40}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9.5"
                      >
                        {day.formattedDate}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Precipitation View */}
            {view === 'precipitation' && (
              <g id="precip-chart-layer">
                {days.map((day, idx) => {
                  const x = getX(idx);
                  const barWidth = 32;
                  const prob = day.precipitationProbability;
                  const barHeight = Math.max(4, (prob / 100) * chartHeight);
                  const y = paddingTop + chartHeight - barHeight;
                  const isHovered = hoveredIndex === idx;

                  return (
                    <g
                      key={day.date}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Probability Bar */}
                      <rect
                        x={x - barWidth / 2}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="5"
                        fill={prob > 50 ? 'url(#precipBarGradient)' : '#93c5fd'}
                        opacity={isHovered ? 1 : 0.85}
                      />

                      {/* Percentage Label */}
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        fill="#1e3a8a"
                        fontSize="11"
                        fontWeight="700"
                      >
                        {prob}%
                      </text>

                      {/* Rainfall Sum (if > 0) */}
                      {day.precipitationSum > 0 && (
                        <text
                          x={x}
                          y={y + 14}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="600"
                        >
                          {day.precipitationSum.toFixed(1)}mm
                        </text>
                      )}

                      {/* X-Axis Day Labels */}
                      <text
                        x={x}
                        y={paddingTop + chartHeight + 26}
                        textAnchor="middle"
                        fill={isHovered ? '#0f172a' : '#64748b'}
                        fontSize="11"
                        fontWeight={isHovered ? '700' : '500'}
                      >
                        {day.dayName}
                      </text>
                      <text
                        x={x}
                        y={paddingTop + chartHeight + 38}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="9.5"
                      >
                        {day.formattedDate}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Legend & Hover Info Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        {view === 'temperature' ? (
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
              Maximum Day Temperature
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
              Overnight Low Temperature
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" />
              Rainfall Probability (%)
            </span>
            <span className="text-slate-400">Values inside bars indicate total millimeter precipitation</span>
          </div>
        )}

        {hoveredIndex !== null && days[hoveredIndex] && (
          <div className="flex items-center gap-2 bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {days[hoveredIndex].dayName}: {getWeatherCodeInfo(days[hoveredIndex].weatherCode).label} •{' '}
              {days[hoveredIndex].precipitationProbability}% rain chance
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
