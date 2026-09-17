import React from 'react';
import {
  Compass,
  Umbrella,
  Shirt,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ThermometerSun,
} from 'lucide-react';
import { WeatherRecommendation } from '../types';

interface PlanningAdvisoryProps {
  recommendation: WeatherRecommendation;
}

export const PlanningAdvisory: React.FC<PlanningAdvisoryProps> = ({ recommendation }) => {
  const {
    outdoorStatus,
    outdoorTitle,
    outdoorDescription,
    umbrellaNeeded,
    umbrellaTitle,
    umbrellaDescription,
    clothingTitle,
    clothingItems,
    clothingDescription,
    environmentalNotice,
    businessAdvisory,
  } = recommendation;

  return (
    <section id="planning-advisory-section" className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-600" />
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">
            Weather-Based Planning Recommendations
          </h3>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">Operational Decision Support</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Outdoor Activity Suitability */}
        <div
          id="advisory-card-outdoor"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Outdoor Suitability
              </span>
              {outdoorStatus === 'favorable' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Favorable
                </span>
              )}
              {outdoorStatus === 'moderate' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertCircle className="w-3 h-3" />
                  Moderate Caution
                </span>
              )}
              {outdoorStatus === 'unfavorable' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertTriangle className="w-3 h-3" />
                  Unfavorable
                </span>
              )}
            </div>

            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">{outdoorTitle}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{outdoorDescription}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Applicable to field visits, outdoor seminars & recreational commutes.
          </div>
        </div>

        {/* Card 2: Rain & Umbrella Guidance */}
        <div
          id="advisory-card-umbrella"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Precipitation Guidance
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  umbrellaNeeded ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Umbrella className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-sm font-semibold text-slate-900 mb-1.5">{umbrellaTitle}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{umbrellaDescription}</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            {umbrellaNeeded ? 'Wet pavement and traffic delays likely.' : 'Clear sidewalks and dry conditions.'}
          </div>
        </div>

        {/* Card 3: Clothing Guidance */}
        <div
          id="advisory-card-clothing"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Attire & Wardrobe
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Shirt className="w-4 h-4" />
              </div>
            </div>

            <h4 className="text-sm font-semibold text-slate-900 mb-1">{clothingTitle}</h4>
            <p className="text-xs text-slate-600 mb-2.5 leading-relaxed">{clothingDescription}</p>

            <ul className="space-y-1">
              {clothingItems.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Recommended for temperature transitions indoors and outdoors.
          </div>
        </div>

        {/* Card 4: Environmental & Business Considerations */}
        <div
          id="advisory-card-environmental"
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Wind / Heat / Travel
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <ThermometerSun className="w-4 h-4" />
              </div>
            </div>

            {environmentalNotice ? (
              <div className="mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{environmentalNotice.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {environmentalNotice.description}
                </p>
              </div>
            ) : (
              <div className="mb-2">
                <div className="text-xs font-semibold text-emerald-800 mb-1">
                  Stable Environmental Levels
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  Moderate wind, comfortable thermal load, and normal UV radiation levels recorded.
                </p>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 mt-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-800 mb-0.5">
                <Briefcase className="w-3 h-3 text-slate-600" />
                <span>Business & Transit Impact</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">{businessAdvisory}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Real-time advisory computed against Open-Meteo observation metrics.
          </div>
        </div>
      </div>
    </section>
  );
};
