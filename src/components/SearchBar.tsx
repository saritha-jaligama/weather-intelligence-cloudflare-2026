import React, { useState } from 'react';
import { Search, X, RotateCcw, Building2, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (cityQuery: string) => void;
  onReset: () => void;
  isLoading: boolean;
  currentCityName?: string;
  initialQuery?: string;
}

const POPULAR_CITIES = [
  { name: 'Chennai', country: 'India' },
  { name: 'London', country: 'UK' },
  { name: 'New York', country: 'USA' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'Singapore', country: 'Singapore' },
  { name: 'Frankfurt', country: 'Germany' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onReset,
  isLoading,
  currentCityName = '',
}) => {
  const [query, setQuery] = useState(currentCityName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleResetAll = () => {
    setQuery('');
    onReset();
  };

  const handleChipClick = (cityName: string) => {
    setQuery(cityName);
    onSearch(cityName);
  };

  return (
    <section id="search-section" className="w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
        {/* Input container */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any global city (e.g. Chennai, London, Chicago, Tokyo)..."
            disabled={isLoading}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-hidden transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          {query.length > 0 && (
            <button
              id="clear-input-btn"
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              title="Clear input text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="search-submit-btn"
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Search</span>
          </button>

          <button
            id="reset-search-btn"
            type="button"
            onClick={handleResetAll}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            title="Reset search and restore default view"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </form>

      {/* Suggested & Validation Quick Chips */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-500 font-medium mr-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Quick Hubs:</span>
        </div>

        {POPULAR_CITIES.map((city) => (
          <button
            key={city.name}
            id={`quick-chip-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
            type="button"
            onClick={() => handleChipClick(city.name)}
            disabled={isLoading}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{city.name}</span>
          </button>
        ))}

        {/* Validation test chip for invalid city */}
        <button
          id="quick-chip-invalid-test"
          type="button"
          onClick={() => handleChipClick('XYZABC123')}
          disabled={isLoading}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors font-medium ml-auto cursor-pointer"
          title="Test invalid city search error handling"
        >
          <span>Test "XYZABC123"</span>
        </button>
      </div>
    </section>
  );
};
