import React from 'react';
import { AlertCircle, RefreshCw, Search, MapPin } from 'lucide-react';

interface ErrorStateProps {
  error: Error | string;
  onRetry: () => void;
  onClear: () => void;
  onSelectCity?: (city: string) => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onClear,
  onSelectCity,
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const isNotFoundError =
    errorMessage.toLowerCase().includes('not found') ||
    (typeof error !== 'string' && error.name === 'CityNotFoundError');

  return (
    <section
      id="error-state-alert"
      className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-8 shadow-xs text-center max-w-2xl mx-auto my-6"
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 id="error-title" className="text-lg font-bold text-slate-900 mb-2">
        {isNotFoundError ? 'City Not Found' : 'Weather Service Error'}
      </h3>

      <p id="error-message-text" className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
        {errorMessage}
      </p>

      {/* Suggested actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          id="error-retry-btn"
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </button>

        <button
          id="error-clear-btn"
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Clear & Search Again</span>
        </button>
      </div>

      {/* Quick alternative suggestions */}
      {onSelectCity && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2 font-medium">
            Or quickly select one of our validated benchmark hubs:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['Chennai', 'London', 'New York', 'Tokyo'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onSelectCity(city)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{city}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
