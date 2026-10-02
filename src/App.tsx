/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { LocationInfo, WeatherData, UserUnits } from './types/weather';
import { SPB_LOCATIONS, fallbackSpbWeather } from './utils/mockData';
import { fetchWeatherData } from './services/weatherService';
import { ambientSound } from './services/ambientAudio';
import { getWeatherVisual } from './utils/weatherCodes';

import { Navbar } from './components/Navbar';
import { DistrictSelector } from './components/DistrictSelector';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { WeeklyForecast } from './components/WeeklyForecast';
import { HourlyForecastSlider } from './components/HourlyForecastSlider';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { PetersburgAtmosphereCard } from './components/PetersburgAtmosphereCard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AppStoreModal } from './components/AppStoreModal';
import { GitHubModal } from './components/GitHubModal';
import { Smartphone, Monitor, Github } from 'lucide-react';

export default function App() {
  const [location, setLocation] = useState<LocationInfo>(SPB_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData>(fallbackSpbWeather);
  const [selectedDayDate, setSelectedDayDate] = useState<string>(fallbackSpbWeather.daily[0]?.date || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('week');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isPhoneFrameActive, setIsPhoneFrameActive] = useState<boolean>(false);
  const [isAppStoreModalOpen, setIsAppStoreModalOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [units, setUnits] = useState<UserUnits>({
    temp: 'C',
    wind: 'ms',
    pressure: 'mmHg',
  });

  // Load weather data on location change or refresh
  const loadWeather = useCallback(async (loc: LocationInfo) => {
    setIsLoading(true);
    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
      if (data.daily && data.daily.length > 0) {
        setSelectedDayDate(data.daily[0].date);
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(location);
  }, [location, loadWeather]);

  // Audio toggle
  const handleToggleAudio = () => {
    const newState = ambientSound.toggle();
    setIsAudioPlaying(newState);
  };

  // Toggle unit preferences
  const handleToggleTempUnit = () => {
    setUnits((prev) => ({
      ...prev,
      temp: prev.temp === 'C' ? 'F' : 'C',
    }));
  };

  const handleTogglePressureUnit = () => {
    setUnits((prev) => ({
      ...prev,
      pressure: prev.pressure === 'mmHg' ? 'hPa' : 'mmHg',
    }));
  };

  // Selected day data
  const selectedDay =
    weatherData.daily.find((d) => d.date === selectedDayDate) ||
    weatherData.daily[0];

  const isSelectedToday = selectedDayDate === weatherData.daily[0]?.date;
  const activeHourlyList =
    isSelectedToday || !selectedDay?.hourlySlots || selectedDay.hourlySlots.length === 0
      ? weatherData.hourly
      : selectedDay.hourlySlots;

  const currentVisual = getWeatherVisual(
    weatherData.current.weatherCode,
    weatherData.current.isDay
  );

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    let targetId = 'week-forecast';
    if (sectionId === 'hourly') targetId = 'hourly-forecast';
    if (sectionId === 'metrics') targetId = 'weather-metrics';
    if (sectionId === 'piter') targetId = 'piter-guide';

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Instant location selection handler
  const handleSelectLocation = (newLoc: LocationInfo) => {
    setLocation(newLoc);
    setWeatherData((prev) => ({
      ...prev,
      location: newLoc,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Dynamic atmospheric background glow */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 bg-gradient-to-b ${currentVisual.bgGradient} opacity-60 z-0`}
      />

      {/* Atmospheric misty accents */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[140px] pointer-events-none z-0" />

      {/* Phone Mode Banner for Desktop users when Phone Frame is active */}
      {isPhoneFrameActive && (
        <div className="hidden md:flex items-center justify-between px-4 py-2 bg-cyan-950/80 border-b border-cyan-800/60 text-xs text-cyan-200 z-50">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Режим экрана смартфона активен (390px × 844px)</span>
          </div>
          <button
            onClick={() => setIsPhoneFrameActive(false)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-cyan-700/60 text-cyan-300 hover:text-white"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Вернуться к широкому экрану</span>
          </button>
        </div>
      )}

      {/* Container wrapper: switches to phone chassis when phone frame mode is on */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isPhoneFrameActive
            ? 'max-w-[420px] w-full mx-auto my-4 border-[8px] border-slate-800/90 rounded-[44px] shadow-2xl overflow-hidden ring-1 ring-slate-700/50 bg-slate-950 min-h-[820px] relative'
            : 'w-full'
        }`}
      >
        {/* Mock Phone Notch when in phone frame preview */}
        {isPhoneFrameActive && (
          <div className="h-6 bg-slate-950 flex items-center justify-center relative shrink-0 z-50">
            <div className="w-24 h-4 bg-slate-900 rounded-full border border-slate-800" />
          </div>
        )}

        {/* Top Bar Header with Integrated Mini-Version Mobile Menu */}
        <Navbar
          units={units}
          onToggleTempUnit={handleToggleTempUnit}
          onTogglePressureUnit={handleTogglePressureUnit}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          isLoading={isLoading}
          onRefresh={() => loadWeather(location)}
          activeSection={activeSection}
          onSelectSection={scrollToSection}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          currentLocation={location}
          onSelectLocation={handleSelectLocation}
          isPhoneFrameActive={isPhoneFrameActive}
          onTogglePhoneFrame={() => setIsPhoneFrameActive(!isPhoneFrameActive)}
          onOpenAppStoreModal={() => setIsAppStoreModalOpen(true)}
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        />

        {/* Main Content Workspace */}
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pb-24 md:pb-16 space-y-5 sm:space-y-6">
          {/* District & Location Quick Selector */}
          <DistrictSelector
            currentLocation={location}
            onSelectLocation={handleSelectLocation}
          />

          {/* Primary Anchor: Current Weather Hero */}
          <CurrentWeatherHero data={weatherData} units={units} />

          {/* Main Forecast Layout: Weekly 7-Day & Hourly Curve */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Left Column: 7-Day Week Forecast (7 cols on desktop) */}
            <div className="lg:col-span-7">
              <WeeklyForecast
                daily={weatherData.daily}
                selectedDayDate={selectedDayDate}
                onSelectDay={(date) => setSelectedDayDate(date)}
                units={units}
                currentTemp={weatherData.current.temperature}
              />
            </div>

            {/* Right Column: 24-Hour Progression & Interactive Chart (5 cols on desktop) */}
            <div className="lg:col-span-5">
              <HourlyForecastSlider
                hourly={activeHourlyList}
                dayTitle={selectedDay?.fullDayName || 'Ближайшие часы'}
                units={units}
              />
            </div>
          </div>

          {/* Meteorological Parameters Grid (Barometer in mmHg, Wind Compass, Sun Arc, etc.) */}
          <WeatherMetricsGrid data={weatherData} units={units} />

          {/* St. Petersburg Atmospheric Card (Umbrella index, outfit guide, Baltic trivia) */}
          <PetersburgAtmosphereCard
            current={weatherData.current}
            precipProb={selectedDay?.precipitationProbability ?? 30}
          />
        </main>

        {/* Quiet, clean editorial footer */}
        <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-mono text-cyan-400 font-bold">w pogoda</span>
              <span aria-hidden="true">·</span>
              <span>Санкт-Петербург</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-end">
              <button
                onClick={() => setIsGitHubModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors text-[11px] font-mono"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Сайт на GitHub</span>
              </button>

              <button
                onClick={() => setIsAppStoreModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 transition-colors text-[11px] font-mono"
              >
                <span>🍏 App Store</span>
              </button>

              <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-500">
                <span>ECMWF & DWD ICON</span>
                <span aria-hidden="true">·</span>
                <span>760 мм рт. ст.</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* GitHub Pages Deployment Guide Modal */}
      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* App Store Export & Packaging Modal */}
      <AppStoreModal
        isOpen={isAppStoreModalOpen}
        onClose={() => setIsAppStoreModalOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar (Dock) */}
      <MobileBottomNav
        activeSection={activeSection}
        onSelectSection={scrollToSection}
        onOpenMobileMenu={() => {
          setIsMobileMenuOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isMobileMenuOpen={isMobileMenuOpen}
      />
    </div>
  );
}

