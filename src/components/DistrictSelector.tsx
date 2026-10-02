import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X, Check } from 'lucide-react';
import { LocationInfo } from '../types/weather';
import { ALL_KNOWN_LOCATIONS } from '../utils/mockData';
import { searchCities } from '../services/weatherService';

interface DistrictSelectorProps {
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
}

export const DistrictSelector: React.FC<DistrictSelectorProps> = ({
  currentLocation,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchCities(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setIsDropdownOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getLocationButtonLabel = (loc: LocationInfo): string => {
    if (loc.name === 'Санкт-Петербург') return 'Центр СПб';
    if (loc.name === 'Приморский район') return 'Лахта';
    if (loc.name === 'Васильевский остров') return 'Васильевский';
    if (loc.name === 'Петроградская сторона') return 'Петроградка';
    return loc.name;
  };

  return (
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Quick Cities & Districts Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mr-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Города и районы:</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {ALL_KNOWN_LOCATIONS.map((loc) => {
              const isSelected =
                Math.abs(currentLocation.latitude - loc.latitude) < 0.02 &&
                Math.abs(currentLocation.longitude - loc.longitude) < 0.02;
              return (
                <button
                  key={loc.name + (loc.district || '')}
                  onClick={() => onSelectLocation(loc)}
                  className={`group flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800/80'
                  }`}
                >
                  {loc.imageUrl && (
                    <img
                      src={loc.imageUrl}
                      alt={loc.district || loc.name}
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 rounded-full object-cover border border-slate-700/80 group-hover:scale-110 transition-transform"
                    />
                  )}
                  <span>{getLocationButtonLabel(loc)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search input for other cities/places */}
        <div className="relative w-full md:w-72" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setIsDropdownOpen(true);
              }}
              placeholder="Поиск города или района..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setIsDropdownOpen(false);
                }}
                className="absolute right-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && (searchQuery.trim().length >= 2 || searchResults.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden py-1 z-50">
              {isSearching ? (
                <div className="px-3 py-2 text-xs text-slate-500">Поиск локаций...</div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                    Результаты поиска
                  </div>
                  {searchResults.map((res, i) => (
                    <button
                      key={`${res.name}-${res.latitude}-${i}`}
                      onClick={() => {
                        onSelectLocation(res);
                        setSearchQuery('');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-between transition-colors"
                    >
                      <div className="truncate flex items-center gap-2">
                        {res.imageUrl && (
                          <img
                            src={res.imageUrl}
                            alt=""
                            aria-hidden="true"
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded object-cover border border-slate-700 shrink-0"
                          />
                        )}
                        <span className="font-semibold text-slate-100">{res.name}</span>
                        {res.district && (
                          <span className="text-slate-400 text-[11px] truncate">
                            ({res.district}{res.country ? `, ${res.country}` : ''})
                          </span>
                        )}
                      </div>
                      <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-2 text-xs text-slate-500">Ничего не найдено</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
