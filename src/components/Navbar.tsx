import React from 'react';
import {
  RotateCw,
  Volume2,
  VolumeX,
  Smartphone,
  Calendar,
  Clock,
  Compass,
  Umbrella,
  ChevronUp,
  MapPin,
  Check,
  Github,
} from 'lucide-react';
import { UserUnits, LocationInfo } from '../types/weather';
import { ALL_KNOWN_LOCATIONS } from '../utils/mockData';

interface NavbarProps {
  units: UserUnits;
  onToggleTempUnit: () => void;
  onTogglePressureUnit: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  isLoading: boolean;
  onRefresh: () => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
  isPhoneFrameActive?: boolean;
  onTogglePhoneFrame?: () => void;
  onOpenAppStoreModal?: () => void;
  onOpenGitHubModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  units,
  onToggleTempUnit,
  onTogglePressureUnit,
  isAudioPlaying,
  onToggleAudio,
  isLoading,
  onRefresh,
  activeSection,
  onSelectSection,
  isMobileMenuOpen,
  onToggleMobileMenu,
  currentLocation,
  onSelectLocation,
  isPhoneFrameActive,
  onTogglePhoneFrame,
  onOpenAppStoreModal,
  onOpenGitHubModal,
}) => {
  const handleNavClick = (sectionId: string) => {
    onSelectSection(sectionId);
    // Keep or close on selection
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 transition-colors">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-baseline text-xl sm:text-2xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <span className="text-cyan-400 font-mono mr-1">w</span>
            <span>pogoda</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 ml-1.5 group-hover:scale-125 transition-transform" />
          </a>
        </div>

        {/* Zone 2: Desktop 4 clean navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectSection('week')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeSection === 'week' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Прогноз на неделю
          </button>
          <button
            onClick={() => onSelectSection('hourly')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeSection === 'hourly' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Почасовой ход
          </button>
          <button
            onClick={() => onSelectSection('metrics')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeSection === 'metrics' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Барометр и ветер
          </button>
          <button
            onClick={() => onSelectSection('piter')}
            className={`transition-colors hover:text-white whitespace-nowrap ${
              activeSection === 'piter' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Питерский зонт
          </button>
        </nav>

        {/* Zone 3: Primary actions & right-hand mobile phone button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unit Toggle Buttons (Desktop) */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={onToggleTempUnit}
              title="Переключить шкалу температуры"
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors text-slate-300 hover:text-white hover:bg-slate-800/80 active:scale-95"
            >
              °{units.temp}
            </button>
            <span className="text-slate-700 text-xs select-none">|</span>
            <button
              onClick={onTogglePressureUnit}
              title="Единицы давления (мм рт. ст. или гПа)"
              className="px-2 py-1 text-xs font-mono font-medium rounded-md transition-colors text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95"
            >
              {units.pressure === 'mmHg' ? 'мм' : 'гПа'}
            </button>
          </div>

          {/* Ambient Sound Button (Desktop) */}
          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? 'Выключить звук дождя' : 'Включить атмосферный звук (дождь и бриз)'}
            className={`hidden sm:flex min-h-[38px] p-2 rounded-lg border text-xs transition-colors items-center gap-1.5 ${
              isAudioPlaying
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden xl:inline text-xs font-medium">
              {isAudioPlaying ? 'Шум дождя' : 'Звук'}
            </span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Обновить данные погоды"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Right Phone Menu Transformation Button */}
          <button
            onClick={onToggleMobileMenu}
            title="Преобразовать в мини-меню для телефона"
            className={`min-h-[38px] px-3 rounded-lg border text-xs font-medium transition-all flex items-center gap-2 ${
              isMobileMenuOpen
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                : 'bg-slate-900/90 border-cyan-500/50 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-400'
            }`}
          >
            <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="whitespace-nowrap font-medium">
              {isMobileMenuOpen ? 'Скрыть мини-меню' : 'Меню телефона'}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                isMobileMenuOpen ? 'bg-cyan-400 animate-ping' : 'bg-cyan-500/60'
              }`}
            />
          </button>
        </div>
      </div>

      {/* MINI-VERSION OF MAIN MENU (Мини-версия основного меню) */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-800/90 bg-slate-950/95 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto space-y-3">
            {/* Header sub-row with Mini Brand & Mode indicator */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold">w pogoda</span>
                <span className="text-[11px] font-mono text-slate-400">· мини-меню</span>
              </div>

              <div className="flex items-center gap-2">
                {onOpenGitHubModal && (
                  <button
                    onClick={onOpenGitHubModal}
                    title="Инструкция и запуск сайта на GitHub Pages"
                    className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700 hover:border-slate-500 transition-colors"
                  >
                    <Github className="w-3 h-3 text-white" />
                    <span>GitHub</span>
                  </button>
                )}

                {onOpenAppStoreModal && (
                  <button
                    onClick={onOpenAppStoreModal}
                    title="Инструкция и экспорт для загрузки в Apple App Store"
                    className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-cyan-500/40 hover:border-cyan-400 transition-colors"
                  >
                    <span>🍏 App Store</span>
                  </button>
                )}

                {onTogglePhoneFrame && (
                  <button
                    onClick={onTogglePhoneFrame}
                    className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                  >
                    <Smartphone className="w-3 h-3 text-cyan-400" />
                    <span>{isPhoneFrameActive ? 'Выйти из рамки телефона' : 'Рамка смартфона'}</span>
                  </button>
                )}
              </div>

              <button
                onClick={onToggleMobileMenu}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <span>Свернуть</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Row 1: The exact 4 nav destinations formatted as a mini-navbar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => handleNavClick('week')}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                  activeSection === 'week'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Прогноз на неделю</span>
              </button>

              <button
                onClick={() => handleNavClick('hourly')}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                  activeSection === 'hourly'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Почасовой ход</span>
              </button>

              <button
                onClick={() => handleNavClick('metrics')}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                  activeSection === 'metrics'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Барометр и ветер</span>
              </button>

              <button
                onClick={() => handleNavClick('piter')}
                className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                  activeSection === 'piter'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <Umbrella className="w-3.5 h-3.5 text-amber-400" />
                <span>Питерский зонт</span>
              </button>
            </div>

            {/* Row 2: Controls Cluster (Units, Sound, Refresh) styled identically to main bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-2">
                {/* Unit Switcher */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                  <button
                    onClick={onToggleTempUnit}
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95"
                  >
                    °{units.temp}
                  </button>
                  <span className="text-slate-700 text-xs select-none">|</span>
                  <button
                    onClick={onTogglePressureUnit}
                    className="px-2 py-1 text-xs font-mono font-medium rounded-md transition-colors text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95"
                  >
                    {units.pressure === 'mmHg' ? 'мм рт.ст.' : 'гПа'}
                  </button>
                </div>

                {/* Sound Ambient Switcher */}
                <button
                  onClick={onToggleAudio}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
                    isAudioPlaying
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isAudioPlaying ? 'Дождь ВКЛ' : 'Шум дождя'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 font-medium disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Обновить погоду</span>
                </button>
              </div>
            </div>

            {/* Row 3: Mini City & District Picker Strip with photos */}
            <div className="pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>Быстрый выбор города и района:</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {ALL_KNOWN_LOCATIONS.map((loc) => {
                  const isSelected =
                    Math.abs(currentLocation.latitude - loc.latitude) < 0.02 &&
                    Math.abs(currentLocation.longitude - loc.longitude) < 0.02;

                  const label =
                    loc.name === 'Санкт-Петербург'
                      ? 'Центр СПб'
                      : loc.name === 'Приморский район'
                      ? 'Лахта'
                      : loc.name === 'Васильевский остров'
                      ? 'Васильевский'
                      : loc.name === 'Петроградская сторона'
                      ? 'Петроградка'
                      : loc.name;

                  return (
                    <button
                      key={loc.name + (loc.district || '')}
                      onClick={() => onSelectLocation(loc)}
                      className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-sm'
                          : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/70'
                      }`}
                    >
                      {loc.imageUrl && (
                        <img
                          src={loc.imageUrl}
                          alt={loc.district || loc.name}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded-full object-cover border border-slate-700"
                        />
                      )}
                      <span>{label}</span>
                      {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
